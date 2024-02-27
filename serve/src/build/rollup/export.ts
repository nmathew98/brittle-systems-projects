import { readFile } from "node:fs/promises";
import { dirname } from "node:path";

import type { EXPORT_FORMATS, Keys } from "../../utilities/constants.js";
import { isImportable } from "../../utilities/is-importable.js";
import { ls } from "../../utilities/ls.js";

export const traverseDirsAndReexport = async (
	path: string | string[],
	format: ExportFormat,
	ignoreDirs?: string[],
) => {
	const dirsToTraverse = [];
	if (Array.isArray(path)) dirsToTraverse.push(...path);
	else dirsToTraverse.push(path);

	const files = [];
	for (const dir of dirsToTraverse)
		for await (const file of ls(dir)) {
			if (ignoreDirs?.some(dir => dirname(file).includes(dir))) continue;

			if (isImportable(file)) files.push(file);
		}

	const pathAndContents: Asset[] = await Promise.all(
		files.map(async file => ({
			path: file,
			code: (await readFile(file)).toString(),
		})),
	);

	const replaceNodeModules = (path: string) =>
		path.replace(/.*\/node_modules\//, "");
	const transformPaths = (asset: Asset) => {
		const _asset = { ...asset };
		const isNodeModule = asset.path.includes("node_modules");

		if (isNodeModule) {
			_asset.path = replaceNodeModules(asset.path);
		}

		return _asset;
	};

	const hasExportStatements = (asset: Asset) =>
		asset.code.includes("export") && asset.code.includes("default");
	const createExportStatement = (asset: Asset, index: number) =>
		`export { default as ${format.toUpperCase()}_${index} } from "${replaceNodeModules(
			asset.path,
		)}"`;

	const filesWithDefaultExports = pathAndContents
		.filter(hasExportStatements)
		.map(transformPaths)
		.map(createExportStatement)
		.join("\n");

	return filesWithDefaultExports;
};

export type ExportFormat = Keys<typeof EXPORT_FORMATS>;

interface Asset {
	path: string;
	code: string;
}
