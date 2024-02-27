export const SERVE_EXPORTS = [
	"createError",
	"isError",
	"readBody",
	"readRawBody",
	"getCookie",
	"parseCookies",
	"setCookie",
	"deleteCookie",
	"getQuery",
	"getRouterParams",
	"getRouterParam",
	"getMethod",
	"isMethod",
	"assertMethod",
	"handleCacheHeaders",
	"getRequestHeader",
	"getRequestHeaders",
	"getResponseHeader",
	"getResponseHeaders",
	"setHeader",
	"setHeaders",
	"setResponseHeader",
	"setResponseHeaders",
	"appendHeader",
	"sendStream",
	"isStream",
	"sendRedirect",
	"createRouter",
	"fromNodeMiddleware",
	"eventHandler",
	"initialize",
	"start",
	"defineMiddleware",
	"defineRoute",
	"defineServeConfig",
	"sendSuccess",
	"sendError",
	"gql",
	"defineQuery",
	"defineMutation",
	"defineSubscription",
	"defineType",
	"defineDirective",
	"useIn",
	"useProduction",
	"getApp",
	"Logger",
	"SymbolAuthorization",
	"RenameTypes",
	"FilterTypes",
	"RenameRootTypes",
	"TransformCompositeFields",
	"TransformRootFields",
	"RenameRootFields",
	"FilterRootFields",
	"TransformObjectFields",
	"RenameObjectFields",
	"RenameObjectFieldArguments",
	"FilterObjectFields",
	"TransformInterfaceFields",
	"RenameInterfaceFields",
	"FilterInterfaceFields",
	"TransformInputObjectFields",
	"RenameInputObjectFields",
	"FilterInputObjectFields",
	"MapLeafValues",
	"TransformEnumValues",
	"TransformQuery",
	"FilterObjectFieldDirectives",
	"RemoveObjectFieldDirectives",
	"RemoveObjectFieldsWithDirective",
	"RemoveObjectFieldDeprecations",
	"RemoveObjectFieldsWithDeprecation",
	"PruneSchema",
	"WrapType",
	"WrapFields",
	"HoistField",
	"MapFields",
	"WrapQuery",
	"ExtractField",
];

export const SCHEMA_DEFINITION_TYPES = {
	Query: "Query",
	Subscription: "Subscription",
	Mutation: "Mutation",
	Types: "Types",
	Directives: "Directives",
} as const;

export const HOOK_KEYS = {
	Route: {
		Protected: "routes:protected",
		Unprotected: "routes:unprotected",
	},
	Middleware: {
		Protected: "middleware:protected",
		Unprotected: "middleware:unprotected",
	},
	Serve: {
		Pre: "serve:pre",
		Post: "serve:post",
	},
} as const;

export const INTERNAL_ROUTES = {
	Api: "/api",
	Subscription: "/api/subscription",
} as const;

export const API_ROUTE_STYLES = {
	GraphQL: "graphql",
	REST: "rest",
} as const;

export const VM_IMPORTS = {
	Middleware: "#middleware",
	Route: "#routes",
	Adapter: "#adapters",
	Entity: "#entities",
	SchemaDefinition: "#schemaDefs",
	Plugin: "#plugins",
} as const;

export const EXPORT_FORMATS = {
	[VM_IMPORTS.Middleware]: "middleware",
	[VM_IMPORTS.Route]: "route",
	[VM_IMPORTS.Adapter]: "adapter",
	[VM_IMPORTS.Entity]: "entity",
	[VM_IMPORTS.SchemaDefinition]: "schemaDef",
	[VM_IMPORTS.Plugin]: "plugin",
} as const;

export const Stores = {
	Module: "ModuleStore",
	Schema: "SchemaStore",
	Serve: "ServeStore",
} as const;

export type Keys<T> = T[keyof T];
