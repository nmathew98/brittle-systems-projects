import type { RouterMethod, Router, App, EventHandler, H3Event } from "h3";
import { createEvent, eventHandler } from "h3";

import type { ServeConfig } from "../serve/serve";
import type { Serve } from "../serve/serve";
import {
	API_ROUTE_STYLES,
	HOOK_KEYS,
	INTERNAL_ROUTES,
} from "../utilities/constants";
import { sendError } from "./utilities";

export interface Route extends BaseRouteConfig {
	route: string;
	method: RouterMethod[];
	setup?: (
		app: App,
		router: Router,
		config: ServeConfig,
		useModule: (key: string | symbol) => any,
	) => Promise<void>;
	use?: Maybe<RouteHandler>;
}

export interface BaseRouteConfig {
	middleware?: EventHandler[];
	protected?: boolean;
	enabled?: boolean; // To allow disabling internal routes mainly
	[key: string]: any;
}

export const defineRoute = (route: Route) => async (serve: Serve) => {
	const fromServeConfig = serve.config.routes?.[route.route];
	const _route = { ...route };

	const overridableProperties: (keyof BaseRouteConfig)[] = [
		"enabled",
		"protected",
		"middleware",
	];
	for (const property of overridableProperties)
		if (
			!isNull(fromServeConfig?.[property]) &&
			!isUndefined(fromServeConfig?.[property])
		)
			_route[property] = fromServeConfig?.[property] as any;

	const hook = _route.protected
		? HOOK_KEYS.Route.Protected
		: HOOK_KEYS.Route.Unprotected;
	const isRouteEnabled = _route?.enabled ?? true;

	if (isRouteEnabled)
		serve.hooks.hook(
			hook,
			async (
				app: App,
				router: Router,
				config: ServeConfig,
				useModule: (key: string | symbol) => any,
			) => {
				if (_route.setup) await _route.setup(app, router, config, useModule);

				// This is a little hacky I but feel its fine because its the only instance
				const isRestApi =
					config.routes[INTERNAL_ROUTES.Api]?.style === API_ROUTE_STYLES.REST;
				const isApiRoute =
					_route.route === INTERNAL_ROUTES.Api ||
					_route.route === INTERNAL_ROUTES.Subscription;

				if (isRestApi && isApiRoute) return;

				const _useRoute = eventHandler(e =>
					safelyHandleNullRouteHandler(_route.use)(e, useModule),
				);
				const _handlers = (_route?.middleware ?? [])
					.concat(_useRoute)
					.map(eventHandler);

				const _combinedHandler = eventHandler(async e => {
					const _e = createEvent(e.req, e.res);

					for (const _handler of _handlers) {
						try {
							if (!_e.res.writableEnded) await _handler(_e);
						} catch (error: any) {
							return sendError(_e, error);
						}
					}

					return _e;
				});

				_route.method.forEach(method =>
					router[method](_route.route, _combinedHandler),
				);
			},
		);
};

const isNull = (x: any): x is null => x === null;
const isUndefined = (x: any): x is undefined => x === undefined;

const safelyHandleNullRouteHandler = (
	f: Maybe<RouteHandler | NoRouteHandler>,
) => {
	let _f: RouteHandler | NoRouteHandler = () => {
		return;
	};

	if (f) _f = f as RouteHandler;

	return _f;
};
type Maybe<T> = T | null | undefined;
type RouteHandler = (
	e: H3Event,
	useModule: (key: string | symbol) => any,
) => Promise<any>;
type NoRouteHandler = () => void;
