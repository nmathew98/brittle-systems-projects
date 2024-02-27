import type { App, EventHandler } from "h3";

import type { Serve, ServeConfig } from "../serve/serve";
import { HOOK_KEYS } from "../utilities/constants";

export interface Middleware {
	protected?: boolean;
	use: (
		config: ServeConfig,
		useModule: (key: string | symbol) => any,
	) => EventHandler;
}

export const defineMiddleware =
	(middleware: Middleware) => async (serve: Serve) => {
		const hook = middleware.protected
			? HOOK_KEYS.Middleware.Protected
			: HOOK_KEYS.Middleware.Unprotected;

		serve.hooks.hook(
			hook,
			async (
				app: App,
				config: ServeConfig,
				useModule: (key: string | symbol) => any,
			) => {
				const handler = middleware.use(config, useModule);

				app.use(handler);
			},
		);
	};
