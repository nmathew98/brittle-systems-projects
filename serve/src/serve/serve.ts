import type { Http2SecureServer, SecureServerOptions } from "node:http2";
import type { Server } from "node:http";
import type { CorsOptions } from "cors";
import type { HelmetOptions } from "helmet";
import type { Hookable } from "hookable";
import type { Transform } from "@graphql-tools/delegate";
import type {
	OutputOptions as RollupOutputOptions,
	Plugin,
	RollupOptions as RollupInputOptions,
} from "rollup";
import type { H3Event, Router } from "h3";
import type { RollupJsonOptions } from "@rollup/plugin-json";
import type { RollupCommonJSOptions } from "@rollup/plugin-commonjs";
import type { RollupNodeResolveOptions } from "@rollup/plugin-node-resolve";
import type { Options as RollupEsbuildOptions } from "rollup-plugin-esbuild";
import {
	createApp,
	createRouter,
	createEvent,
	toNodeListener,
	eventHandler,
} from "h3";
import { createHooks } from "hookable";
import { readFile } from "node:fs/promises";

import type { BaseRouteConfig } from "../route/route";
import type { Keys, API_ROUTE_STYLES } from "../utilities/constants";
import {
	moduleStore,
	schemaDefinitionStore,
	useStore,
} from "../utilities/store";
import { Logger } from "../adapter/internal/logger/logger";
import { HOOK_KEYS, INTERNAL_ROUTES } from "../utilities/constants";
import { SymbolAuthorization } from "../adapter/types/authorization/authorization";
import { sendError } from "../route/utilities";
import { useProduction } from "../utilities/use-in";

export interface Serve {
	config: ServeConfig;
	hooks: Hookable<any, any>;
	initialize: (config?: ServeInitConfig) => Promise<void>;
	listen: (event?: H3Event) => Promise<any>;
	stores: {
		modules: Map<any, any>;
		schemaDefinitions: Map<any, any>;
	};
}

export interface ServeInitConfig {
	hooks: Partial<{
		pre: any;
		post: any;
	}>;
}

export interface ServeConfig {
	server: {
		app?: Record<string, any>;
		ssl?: {
			key: string;
			cert: string;
		};
		sentry?: {
			dsn?: string;
			tracesSampleRate?: number;
			environment?: string;
		};
		sofaApi?: {
			info: Record<string, any>;
			servers?: Record<string, any>[];
			components?: Record<string, any>;
			security?: Record<string, any>[];
			tags?: Record<string, any>[];
		};
	};
	build?: {
		input?: RollupInputOptions;
		output?: RollupOutputOptions;
		autoImports?: { [key: string]: string[] }[];
		autoImportDirs?: string[];
		rollupPlugins?: Plugin[];
		standardPlugins?: {
			json?: RollupJsonOptions;
			commonjs?: RollupCommonJSOptions;
			nodeResolve?: RollupNodeResolveOptions;
			esbuild?: RollupEsbuildOptions;
		};
	};
	middleware?: {
		cors?: CorsOptions;
		helmet?: HelmetOptions;
		[key: string]: any;
	};
	routes: Partial<{
		[INTERNAL_ROUTES.Api]: BaseRouteConfig & {
			subgraphs?: GraphQLSubgraph[];
			style?: Keys<typeof API_ROUTE_STYLES>;
		};
		[INTERNAL_ROUTES.Subscription]: BaseRouteConfig;
		[key: string]: BaseRouteConfig;
	}>;
	modules?: {
		[key: string]: any;
	};
	alias: {
		[key: string]: string;
	};
}

export interface GraphQLSubgraph {
	/**
	 * The remote location of the subgraph
	 */
	location: string;
	/**
	 * A record of the headers if any are required for authorization
	 */
	headers?: Record<string, any>;
	/**
	 * Transforms for the subgraph
	 */
	transforms?: Transform[];
}

export const createServe = (config: Partial<ServeConfig>): Serve => {
	const unprotectedRouter = createRouter();
	const protectedRouter = createRouter();
	const app = createApp({ debug: useProduction(false, true) });

	const useModule = (key: string | symbol) => useStore(key, moduleStore);
	const _useModule = (key: string | symbol) => {
		const [mod] = useModule(key);

		return mod;
	};

	const [, setApp] = useStore("app");
	setApp(app);

	const hooks: Hookable<any, any> = createHooks();

	const allAvailableConfiguration = [
		{
			app,
			router: {
				unprotected: unprotectedRouter,
				protected: protectedRouter,
			},
			config,
			useModule: _useModule,
		},
	];
	const middlewareArguments = [app, config, _useModule];
	const unprotectedRouteArguments = [
		app,
		unprotectedRouter,
		config,
		_useModule,
	];
	const protectedRouteArguments = [app, protectedRouter, config, _useModule];

	// The reason for the layer of indirection is because
	// H3 only supports having one router by default
	// We only return a truthy value if the `writableEnded` flag
	// has been set, I think this is already handled internally
	// properly by H3 but just in case
	const handleEventWithRouter = async (
		e: H3Event,
		router: Router,
		type: "protected" | "unprotected",
	) => {
		if (e.res.writableEnded) return e;

		const _e = createEvent(e.req, e.res);
		try {
			return await router.handler(_e);
		} catch (error: any) {
			// Here we have two cases:

			// If after checking the unprotected router and
			// we get a route not found error then if
			// there is no Authorization module there are no
			// protected routes and we should throw any errors
			if (type === "unprotected") {
				const Authorization = _useModule(SymbolAuthorization);

				if (!Authorization) return sendError(_e, error);
			}

			// If after checking the protected router and we
			// get a route not found error then just throw
			// the error because the route definitely does not exist
			if (type === "protected") return sendError(_e, error);
		}

		return;
	};

	const addInitHook = (key: string, _hooks: any[] | any) => {
		if (Array.isArray(_hooks)) _hooks.forEach(hook => hooks.hook(key, hook));
		else if (_hooks) hooks.hook(key, _hooks);
	};

	return Object.freeze({
		config,
		hooks,
		stores: {
			modules: moduleStore,
			schemaDefinitions: schemaDefinitionStore,
		},
		initialize: async (config?: Partial<ServeInitConfig>) => {
			addInitHook(HOOK_KEYS.Serve.Pre, config?.hooks?.pre);
			addInitHook(HOOK_KEYS.Serve.Post, config?.hooks?.post);

			hooks.hook(HOOK_KEYS.Route.Unprotected, () =>
				app.use(
					eventHandler(e =>
						handleEventWithRouter(e, unprotectedRouter, "unprotected"),
					),
				),
			);
			hooks.hook(HOOK_KEYS.Route.Protected, () =>
				app.use(
					eventHandler(e =>
						handleEventWithRouter(e, protectedRouter, "protected"),
					),
				),
			);

			const inSequence: [string, any[]][] = [
				[HOOK_KEYS.Middleware.Unprotected, middlewareArguments],
				[HOOK_KEYS.Route.Unprotected, unprotectedRouteArguments],
				[HOOK_KEYS.Middleware.Protected, middlewareArguments],
				[HOOK_KEYS.Route.Protected, protectedRouteArguments],
				[HOOK_KEYS.Serve.Post, allAvailableConfiguration],
			];

			hooks.afterEach(event => {
				Logger.success(`✅ Loaded hook ${event.name}`);

				const next = inSequence.splice(0, 1).pop();

				if (next) hooks.callHook(next[0], ...next[1]);
			});

			hooks.callHook(HOOK_KEYS.Serve.Pre, ...allAvailableConfiguration);
		},
		listen: async (event?: H3Event) => {
			const isRunningInNode = () => process?.release?.name === "node";

			const PORT = process.env.PORT || 4000;

			if (typeof process === "undefined" || (!isRunningInNode() && event))
				return app.handler(event as H3Event);
			else {
				let server: Http2SecureServer | Server;

				if (
					typeof process.env.SSL_KEY !== "undefined" &&
					typeof process.env.SSL_CERT !== "undefined"
				) {
					const { createSecureServer } = await import("node:http2");
					const { App: TinyHttpApp } = await import("@tinyhttp/app");

					const tinyhttp = new TinyHttpApp();
					tinyhttp.use(toNodeListener(app));

					const secureServerOptions: SecureServerOptions = {
						key: await readFile(process.env.SSL_KEY),
						cert: await readFile(process.env.SSL_CERT),
						allowHTTP1: true,
					};

					// @ts-expect-error: The docs said we should
					server = createSecureServer(secureServerOptions, tinyhttp.handler);
				} else {
					const { createServer: createLegacyServer } = await import(
						"node:http"
					);

					server = createLegacyServer(toNodeListener(app));
				}

				server.listen(PORT);
			}

			Logger.log(`🚀 Listening on port ${PORT}`);
		},
	} as Serve);
};

export const defineServeConfig = (config: Partial<ServeConfig>) =>
	Object.freeze(config);
