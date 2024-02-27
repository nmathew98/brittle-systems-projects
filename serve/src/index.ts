import { useStore } from "./utilities/store";

// Core
export {
	createError,
	isError,
	readBody,
	readRawBody,
	getCookie,
	parseCookies,
	setCookie,
	deleteCookie,
	getQuery,
	getRouterParams,
	getRouterParam,
	getMethod,
	isMethod,
	assertMethod,
	handleCacheHeaders,
	getRequestHeader,
	getRequestHeaders,
	getResponseHeader,
	getResponseHeaders,
	getHeader,
	getHeaders,
	setHeader,
	setHeaders,
	setResponseHeader,
	setResponseHeaders,
	appendResponseHeader,
	appendResponseHeaders,
	appendHeader,
	sendStream,
	isStream,
	sendRedirect,
	createRouter,
	fromNodeMiddleware,
	eventHandler,
} from "h3";
export { initialize, start } from "./server";
export { defineMiddleware } from "./middleware/middleware";
export { defineRoute } from "./route/route";
export { definePlugin, PluginConfig } from "./plugin/plugin";
export { defineServeConfig } from "./serve/serve";
export { sendSuccess, sendError, gql } from "./route/utilities";
export {
	defineQuery,
	defineMutation,
	defineSubscription,
	defineType,
	defineDirective,
} from "./route/api/define-schema-definition";
export { useIn, useProduction } from "./utilities/use-in";
export { SymbolAuthorization } from "./adapter/types/authorization/authorization";

const [, getApp] = useStore("app");
export { getApp };

// Adapters
export { Logger } from "./adapter/internal/logger/logger";
export { Authorization } from "./adapter/types/authorization/authorization";

// GraphQL utilities and types
export {
	RenameTypes,
	FilterTypes,
	RenameRootTypes,
	TransformCompositeFields,
	TransformRootFields,
	RenameRootFields,
	FilterRootFields,
	TransformObjectFields,
	RenameObjectFields,
	RenameObjectFieldArguments,
	FilterObjectFields,
	TransformInterfaceFields,
	RenameInterfaceFields,
	FilterInterfaceFields,
	TransformInputObjectFields,
	RenameInputObjectFields,
	FilterInputObjectFields,
	MapLeafValues,
	TransformEnumValues,
	TransformQuery,
	FilterObjectFieldDirectives,
	RemoveObjectFieldDirectives,
	RemoveObjectFieldsWithDirective,
	RemoveObjectFieldDeprecations,
	RemoveObjectFieldsWithDeprecation,
	PruneSchema,
	WrapType,
	WrapFields,
	HoistField,
	MapFields,
	WrapQuery,
	ExtractField,
} from "@graphql-tools/wrap";
