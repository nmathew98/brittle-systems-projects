import type { Serve } from "../serve/serve";
import type { defineMiddleware } from "../middleware/middleware";
import type { Entity } from "../entity/entity";
import type { Adapter } from "../adapter/adapter";
import type { BaseRouteConfig, defineRoute } from "../route/route";
import type {
	defineDirective,
	defineMutation,
	defineQuery,
	defineSubscription,
	defineType,
} from "../route/api/define-schema-definition";
import { HOOK_KEYS } from "../utilities/constants";
import { initializeFragments } from "../utilities/vm";

export const definePlugin =
	(plugin: Plugin) => (config: PluginConfig) => async (serve: Serve) => {
		const addInitHook = (key: string, _hooks: any[] | any) => {
			if (Array.isArray(_hooks))
				_hooks.forEach(hook => serve.hooks.hook(key, hook));
			else if (_hooks) serve.hooks.hook(key, _hooks);
		};

		addInitHook(HOOK_KEYS.Serve.Pre, plugin?.hooks?.pre);
		addInitHook(HOOK_KEYS.Serve.Post, plugin?.hooks?.post);

		serve.config = {
			...serve.config,
			modules: {
				...plugin?.defaultConfig?.modules,
				...config?.modules,
				...serve.config?.modules,
			},
			routes: {
				...plugin?.defaultConfig?.routes,
				...config?.routes,
				...serve.config?.routes,
			},
			middleware: {
				...plugin?.defaultConfig?.middleware,
				...config?.middleware,
				...serve.config?.middleware,
			},
		};

		await initializeFragments(serve, plugin);
	};

export interface PluginConfig {
	modules?: {
		[key: string]: any;
	};
	routes?: {
		[key: string]: BaseRouteConfig;
	};
	middleware?: {
		[key: string]: any;
	};
}

export interface Plugin {
	name: string;
	hooks?: Partial<{
		pre?: any | any[];
		post?: any | any[];
	}>;
	middleware?: ReturnType<typeof defineMiddleware>[];
	entities?: Entity[];
	adapters?: Adapter[];
	api?: Partial<{
		queries: ReturnType<typeof defineQuery>[];
		mutations: ReturnType<typeof defineMutation>[];
		subscriptions: ReturnType<typeof defineSubscription>[];
		types: ReturnType<typeof defineType>[];
		directives: ReturnType<typeof defineDirective>[];
	}>;
	routes?: ReturnType<typeof defineRoute>[];
	defaultConfig?: PluginConfig;
}
