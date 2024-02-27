import { defineRoute } from "../../route";
import { createStitchedSchema } from "../../api/schema/schema";
import {
	API_ROUTE_STYLES,
	INTERNAL_ROUTES,
} from "../../../utilities/constants";

let handler: any;

export default defineRoute({
	route: INTERNAL_ROUTES.Api,
	method: ["post"],
	protected: true,
	enabled: true,
	async setup(app, _, config, useModule) {
		await createStitchedSchema(config);

		if (process.env.API_ROUTE_STYLE === API_ROUTE_STYLES.REST) {
			const { getRestStyleHandler } = await import("../../api/handlers/rest");

			const { setup } = await getRestStyleHandler(config);

			setup(app, _, useModule);
		} else {
			const { getGraphQLStyleHandler } = await import(
				"../../api/handlers/graphql"
			);

			({ handler } = await getGraphQLStyleHandler(config));
		}
	},
	use: (e, useModule) => (handler ? handler(e, useModule) : null),
});
