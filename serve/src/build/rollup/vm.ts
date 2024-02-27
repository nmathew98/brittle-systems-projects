import { resolve } from "node:path";

import type { ExportFormat } from "./export.js";
import { findRootDir } from "../../utilities/root-dir.js";
import { traverseDirsAndReexport } from "./export.js";
import { EXPORT_FORMATS, VM_IMPORTS } from "../../utilities/constants.js";

export const createVirtualModules = async () => {
	const collated = await generateExports();

	const getCode = (nameOfExport: string) =>
		collated
			.filter(_export => _export.label === nameOfExport)
			.map(_export => _export.code)
			.join("\n");

	return {
		[VM_IMPORTS.Plugin]: getCode(EXPORT_FORMATS[VM_IMPORTS.Plugin]),
		[VM_IMPORTS.Adapter]: getCode(EXPORT_FORMATS[VM_IMPORTS.Adapter]),
		[VM_IMPORTS.Entity]: getCode(EXPORT_FORMATS[VM_IMPORTS.Entity]),
		[VM_IMPORTS.Middleware]: getCode(EXPORT_FORMATS[VM_IMPORTS.Middleware]),
		[VM_IMPORTS.SchemaDefinition]: getCode(
			EXPORT_FORMATS[VM_IMPORTS.SchemaDefinition],
		),
		[VM_IMPORTS.Route]: getCode(EXPORT_FORMATS[VM_IMPORTS.Route]),
	};
};

const generateExports = async () => {
	const projectRoot = findRootDir();

	const serveDir = resolve(
		projectRoot,
		"./node_modules/@skulpture/serve/dist/",
	);
	const allPlugins = [resolve(projectRoot, "./src/external/plugins")];
	const allRoutes = [
		resolve(serveDir, "./route/internal"),
		resolve(projectRoot, "./src/external/routes"),
	];
	const allAdapters = [
		resolve(serveDir, "./adapter/internal"),
		resolve(projectRoot, "./src/external/adapters"),
	];
	const allEntities = [resolve(projectRoot, "./src/entities")];
	const allMiddleware = [
		resolve(serveDir, "./middleware/internal"),
		resolve(projectRoot, "./src/external/middleware"),
	];
	const allSchemaDefs = [
		resolve(projectRoot, "./src/external/routes/api/queries"),
		resolve(projectRoot, "./src/external/routes/api/mutations"),
		resolve(projectRoot, "./src/external/routes/api/subscriptions"),
		resolve(projectRoot, "./src/external/routes/api/types"),
		resolve(projectRoot, "./src/external/routes/api/directives"),
	];

	const locationsOfExports: { [key: string]: any } = {
		plugin: {
			dirs: allPlugins,
		},
		route: {
			dirs: allRoutes,
			ignoreDirs: ["queries", "mutations", "subscriptions", "types"],
		},
		adapter: {
			dirs: allAdapters,
		},
		entity: {
			dirs: allEntities,
		},
		middleware: {
			dirs: allMiddleware,
		},
		schemaDef: {
			dirs: allSchemaDefs,
		},
	};

	const collatedExports = await Promise.all(
		Object.keys(locationsOfExports).map(async location => ({
			label: location,
			code: await traverseDirsAndReexport(
				locationsOfExports[location].dirs,
				location as ExportFormat,
				locationsOfExports[location]?.ignoreDirs,
			),
		})),
	);

	return collatedExports;
};
