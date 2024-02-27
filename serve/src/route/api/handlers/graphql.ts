import type { H3Event } from "h3";
import type { ServeConfig } from "../../../serve/serve";
import { readBody, sendError } from "h3";

import { useStore } from "../../../utilities/store";
import { graphql } from "../../../utilities/graphql";

export const getGraphQLStyleHandler = async (config: ServeConfig) => {
	const handler = async (e: H3Event, useModule: any) => {
		try {
			const [schema] = useStore("schema");

			if (!schema) throw new Error("API route has not been set up yet");

			const body: any = await readBody(e);

			if (typeof body !== "object" || !body.query)
				throw new Error("Invalid request");

			const result = await graphql({
				schema,
				source: body.query,
				variableValues: body.variables,
				contextValue: {
					req: e.req,
					res: e.res,
					useModule,
					config: config?.server?.app ?? Object.create(null),
				},
			});

			e.req.statusCode = 200;
			e.res.setHeader("Content-Type", "application/json");

			return e.res.end(JSON.stringify(result));
		} catch (error: any) {
			return sendError(e, error);
		}
	};

	return { handler };
};
