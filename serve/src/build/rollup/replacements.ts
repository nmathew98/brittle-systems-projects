import dotenv from "dotenv";

import type { ServeConfig } from "../../serve/serve.js";
import { API_ROUTE_STYLES } from "../../utilities/constants.js";
import { findRootDir } from "../../utilities/root-dir.js";
import { useProduction } from "../../utilities/use-in.js";

export const getReplacements = (config: ServeConfig) => {
	const projectDir = findRootDir();

	dotenv.config({
		path: `${projectDir}/.env`,
		debug: useProduction(false, true),
	});

	const processEnv: { [key: string]: any } = {
		...process.env,
		SSL_KEY: config.server?.ssl?.key,
		SSL_CERT: config.server?.ssl?.cert,
		API_ROUTE_STYLE: config.routes?.["/api"]?.style,
	};

	const stringify = (value: any) =>
		typeof value === "string" ? JSON.stringify(value) : value;

	const processEnvReplacements = Object.keys(processEnv).reduce(
		(acc, cv) => ({
			...acc,
			[`process.env.${cv}`]: stringify(processEnv[cv]),
			[`process['env']['${cv}]`]: stringify(processEnv[cv]),
			[`process?.env?.${cv}`]: stringify(processEnv[cv]),
		}),
		Object.create(null),
	);

	const apiRouteStyleConstants = Object.keys(API_ROUTE_STYLES).reduce(
		(acc, cv) => ({
			...acc,
			[`API_ROUTE_STYLES.${cv}`]: stringify((API_ROUTE_STYLES as any)[cv]),
		}),
		Object.create(null),
	);

	return {
		...processEnvReplacements,
		...apiRouteStyleConstants,
	};
};
