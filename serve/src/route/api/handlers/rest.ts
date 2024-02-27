import type { App } from "h3";
import { toEventHandler } from "h3";
import { OpenAPI, useSofa } from "sofa-api";

import type { ServeConfig } from "../../../serve/serve";
import { useStore } from "../../../utilities/store";
import { findRootDir } from "../../../utilities/root-dir";
import { graphql } from "../../../utilities/graphql";

export const getRestStyleHandler = async (config: ServeConfig) => {
	let openApi: any;

	const [schema] = useStore("schema");

	if (!schema) throw new Error("API route has not been set up yet");

	const setup = (app: App, _: any, useModule: any) => {
		const projectRoot = findRootDir();

		if (config?.server?.sofaApi?.info)
			openApi = OpenAPI({
				schema,
				...(config.server.sofaApi as any),
			});

		openApi?.save(`${projectRoot}/swagger.yml`);

		app.use("/api", handler(useModule));
	};

	const handler = (useModule: any) =>
		toEventHandler(
			useSofa({
				basePath: "/api",
				schema,
				context: ({ req, res }) => ({
					req,
					res,
					useModule,
					config: config?.server?.app ?? Object.create(null),
				}),
				onRoute: info => {
					openApi?.addRoute(info, {
						basePath: "/api",
					});
				},
				execute: graphql,
			}),
		);

	return { setup, handler };
};
