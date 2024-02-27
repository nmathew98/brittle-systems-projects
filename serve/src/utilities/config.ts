import { resolve } from "node:path";
import { loadConfig } from "c12";

import { API_ROUTE_STYLES, INTERNAL_ROUTES } from "./constants.js";
import { findRootDir } from "./root-dir.js";
import { useStore } from "./store.js";

export const config = async () => {
	{
		const [config] = useStore("config");

		if (config) return config;
	}

	const projectRoot = findRootDir();

	const defaults = {
		routes: {
			[INTERNAL_ROUTES.Api]: {
				style: API_ROUTE_STYLES.GraphQL,
			},
		},
		alias: {
			"@entities": resolve(projectRoot, "./src/entities"),
			"@composables": resolve(projectRoot, "./src/composables"),
			"@adapters": resolve(projectRoot, "./src/external/adapters"),
		},
	};

	const { config } = await loadConfig({
		cwd: resolve(projectRoot),
		name: "serve",
		dotenv: true,
		defaults,
	});

	const [, setConfig] = useStore("config");
	setConfig(config);

	return config;
};
