import type { GraphQLSchema } from "graphql";
import type { createHandler as createSSEHandler } from "graphql-sse";
import type { ServeConfig } from "../../../serve/serve";
import { fromNodeMiddleware } from "h3";

import { useStore } from "../../../utilities/store";
import { defineRoute } from "../../route";
import {
	API_ROUTE_STYLES,
	INTERNAL_ROUTES,
} from "../../../utilities/constants";

let createHandler: typeof createSSEHandler;

let schema: GraphQLSchema;
let subscriptionHandler: ReturnType<typeof createHandler>;
let serveConfig: ServeConfig;

export default defineRoute({
	route: INTERNAL_ROUTES.Subscription,
	method: ["post"],
	protected: true,
	enabled: true,
	setup: async (_0, _1, config) => {
		if (process.env.API_ROUTE_STYLE === API_ROUTE_STYLES.GraphQL)
			({ createHandler } = await import("graphql-sse"));

		serveConfig = config;
	},
	use: async (e, useModule) => {
		if (!schema) [schema] = useStore("schema");

		if (!subscriptionHandler)
			subscriptionHandler = createHandler({
				schema,
				context: {
					req: e.req,
					res: e.res,
					useModule,
					config: serveConfig?.server?.app ?? Object.create(null),
				},
			});

		return fromNodeMiddleware(subscriptionHandler)(e);
	},
});
