import type { Serve } from "../serve/serve";
import type { Plugin } from "../plugin/plugin";
import { defineAdapter } from "../adapter/adapter";
import { defineEntity } from "../entity/entity";
import { moduleStore, schemaDefinitionStore } from "./store";
import { VM_IMPORTS } from "./constants";

export const initializeFragments = async (serve: Serve, plugin?: Plugin) => {
	let serveMiddleware = [],
		serveRoutes = [],
		serveAdapters = [],
		serveEntities = [],
		schemaDefs = [],
		plugins = [];

	if (!plugin)
		[
			serveMiddleware,
			serveRoutes,
			serveAdapters,
			serveEntities,
			schemaDefs,
			plugins,
		] = await loadVirtualModules();
	else
		[serveMiddleware, serveRoutes, serveAdapters, serveEntities] = [
			plugin.middleware ?? [],
			plugin.routes ?? [],
			plugin.adapters ?? [],
			plugin.entities ?? [],
		];

	await Promise.all(Object.values(plugins).map((plugin: any) => plugin(serve)));
	await Promise.all(
		Object.values(schemaDefs).map((schemaDef: any) => schemaDef()),
	);
	await Promise.all(
		Object.values(serveMiddleware).map((middleware: any) => middleware(serve)),
	);

	// Order here is important, adapters must be initialized before entities
	await Promise.all(
		Object.values(serveAdapters).map((adapter: any) =>
			defineAdapter(adapter)(serve.config),
		),
	);
	await Promise.all(
		Object.values(serveEntities).map((entity: any) =>
			defineEntity(entity)(serve.config),
		),
	);

	// Here since the 'plugins' store is distinct from the parent's store
	// we need to transfer them over
	if (plugin) await transferPluginDefinitions(serve, plugin);

	await Promise.all(
		Object.values(serveRoutes).map((route: any) => route(serve)),
	);
};

const transferPluginDefinitions = async (serve: Serve, plugin: Plugin) => {
	const _PromiseAll = (x?: Promise<any>[] | void) => Promise.all(x ?? []);

	await _PromiseAll(plugin.api?.queries?.map(query => query()));
	await _PromiseAll(plugin.api?.mutations?.map(mutation => mutation()));
	await _PromiseAll(
		plugin.api?.subscriptions?.map(subscription => subscription()),
	);
	await _PromiseAll(plugin.api?.directives?.map(directive => directive()));
	await _PromiseAll(plugin.api?.types?.map(type => type()));

	const pluginModuleStore = moduleStore;
	const mainModuleStore = serve.stores.modules;

	const pluginSchemaDefinitionStore = schemaDefinitionStore;
	const mainSchemaDefinitionStore = serve.stores.schemaDefinitions;

	pluginModuleStore.forEach((value: any, key: any) =>
		mainModuleStore.set(key, value),
	);
	pluginSchemaDefinitionStore.forEach((value: any, key: any) =>
		mainSchemaDefinitionStore.set(key, value),
	);
};

const loadVirtualModules = () =>
	Promise.all(
		Array(6)
			.fill(Object.create(null))
			.map((_, i) => {
				switch (i) {
					case 0:
						return import(VM_IMPORTS.Middleware);
					case 1:
						return import(VM_IMPORTS.Route);
					case 2:
						return import(VM_IMPORTS.Adapter);
					case 3:
						return import(VM_IMPORTS.Entity);
					case 4:
						return import(VM_IMPORTS.SchemaDefinition);
					case 5:
						return import(VM_IMPORTS.Plugin);
					default:
						return Object.create(null);
				}
			}),
	);
