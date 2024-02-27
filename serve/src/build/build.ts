import type {
	OutputOptions as RollupOutputOptions,
	RollupBuild,
	RollupCache,
	RollupWatchOptions,
} from "rollup";
import type { ChildProcess } from "node:child_process";
import { resolve } from "node:path";
import { rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import process from "node:process";
import consola from "consola";
import autoInstall from "@rollup/plugin-auto-install";
import AutoImport from "unplugin-auto-import/rollup";
import alias from "@rollup/plugin-alias";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import virtual from "@rollup/plugin-virtual";
import json from "@rollup/plugin-json";
import esbuild from "rollup-plugin-esbuild";
import replace from "@rollup/plugin-replace";
import { rollup, watch as rollupWatch, defineConfig } from "rollup";

import type { ServeConfig } from "../serve/serve.js";
import { findRootDir } from "../utilities/root-dir.js";
import { createVirtualModules } from "./rollup/vm.js";
import { useProduction } from "../utilities/use-in.js";
import { SERVE_EXPORTS } from "../utilities/constants.js";
import { createFolder } from "../utilities/create-folder.js";
import { watchInput } from "./rollup/watch.js";
import { prompt as dockerPrompt } from "./docker/prompt.js";
import { getReplacements } from "./rollup/replacements.js";

let cache: RollupCache | undefined;

const AUTO_INSTALL_FLAG = "--auto-install";

export const build = async (config: ServeConfig, nodeArgs: string[]) => {
	await dockerPrompt();
	consola.wrapAll();

	const rollupOptions = await getRollupInputOptions({
		...config,
		autoInstall: nodeArgs.includes(AUTO_INSTALL_FLAG),
	});

	const bundle: RollupBuild = await rollup(rollupOptions);

	let exitCode = 0;
	try {
		clearScreen();
		await generateOutputs(bundle, config);

		const successMessage = ["✅ Successfully built: .output/app.mjs"];
		if (bundle.getTimings) {
			const timings = bundle.getTimings();

			const [ms] = timings["# BUILD"] as number[];

			successMessage.push(`${ms?.toFixed(2)} ms`);
		}

		consola.success(successMessage.join(" in "));
	} catch (error: any) {
		consola.error(error);
		exitCode = 1;
	}

	await bundle.close();
	consola.restoreAll();
	process.exit(exitCode);
};

export const watch = async (config: ServeConfig, nodeArgs: string[]) => {
	await dockerPrompt();
	consola.wrapAll();

	const projectRoot = findRootDir();
	const rollupInputOptions = await getRollupInputOptions({
		...config,
		autoInstall: nodeArgs.includes(AUTO_INSTALL_FLAG),
	});
	const rollupOutputOptions = getRollupOutputOptions(config);

	const watchPlugins = [watchInput(`${projectRoot}/src`)];
	const watchOptions: RollupWatchOptions = {
		...rollupInputOptions,
		plugins: (rollupInputOptions.plugins as any[])?.concat(watchPlugins),
		output: rollupOutputOptions,
	};

	const watcher = rollupWatch(watchOptions);

	let buildCount = 0;
	let exitCode = 0;
	let nodeProcess: ChildProcess | undefined;

	watcher.on("event", async event => {
		await removeOutputs(projectRoot);
		nodeProcess?.kill();

		if (event.code === "START") {
			clearScreen();
			if (buildCount > 0) consola.info("⌛ Changes detected, rebuilding ...");
		}

		if (event.code === "BUNDLE_END") {
			const { duration, result } = event;

			await generateOutputs(result, config);

			consola.success(
				`✅ Successfully built: .output/app.mjs in ${duration.toFixed(2)} ms`,
			);

			cache = result.cache;

			result.close();
			buildCount++;
			exitCode = 0;
			clearScreen();

			const serveArgs = [AUTO_INSTALL_FLAG];
			const _nodeArgs = nodeArgs.filter(arg => !serveArgs.includes(arg));
			nodeProcess = spawn("node", [..._nodeArgs, "./.output/app.mjs"], {
				cwd: projectRoot,
				stdio: "inherit",
				detached: true,
			});

			nodeProcess.on("error", error => {
				consola.error(error);
				process.exit(1);
			});
		}

		if (event.code === "ERROR") {
			const { error, result } = event;

			consola.error(error);
			result?.close();
			exitCode = 1;
		}
	});

	// Doesn't work on windows?
	// https://stackoverflow.com/questions/20165605/detecting-ctrlc-in-node-js
	process.on("SIGINT", async () => {
		await watcher.close();
		nodeProcess?.kill();
		process.exit(exitCode);
	});
};

const getRollupInputOptions = async (
	config: ServeConfig & { autoInstall: boolean },
) => {
	const projectRoot = findRootDir();

	await removeOutputs(projectRoot);
	await createFolder(`${projectRoot}/src/serve/types`);

	const customResolver = nodeResolve({
		extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
	});
	const aliases = Object.keys(config.alias).map(alias => ({
		find: new RegExp(`${alias}/(.*)`),
		replacement: `${config.alias[alias]}/$1`,
	}));

	const virtualModules = await createVirtualModules();

	const standardRollupPlugins = [
		replace({
			values: getReplacements(config),
			preventAssignment: true,
			objectGuards: true,
		}),
		json({
			preferConst: true,
			compact: true,
			...config.build?.standardPlugins?.json,
		}),
		alias({
			entries: aliases,
			customResolver: customResolver as any,
		}),
		virtual(virtualModules),
		AutoImport({
			include: /mjs|js|ts|jsx|tsx/,
			imports: [
				{
					"@skulpture/serve": SERVE_EXPORTS,
				},
				...(config.build?.autoImports ?? []),
			],
			dirs: [
				`${projectRoot}/src/composables/**`,
				...(config.build?.autoImportDirs ?? []),
			],
			dts: `${projectRoot}/src/serve/types/auto-imports.d.ts`,
			eslintrc: {
				enabled: true,
			},
		}),
		...(config.autoInstall
			? [
					autoInstall({
						manager: "pnpm",
					}),
			  ]
			: []),
		...(config.build?.rollupPlugins ?? []),
		commonjs({
			strictRequires: true,
			transformMixedEsModules: true,
			...config.build?.standardPlugins?.commonjs,
		}),
		nodeResolve({
			preferBuiltins: true,
			...config.build?.standardPlugins?.nodeResolve,
		}),
		esbuild({
			minify: useProduction(true, false),
			target: "esnext",
			loaders: {
				".json": "json",
			},
			...config.build?.standardPlugins?.esbuild,
		}),
	];

	const rollupOptions = defineConfig({
		...config.build?.input,
		input: resolve(projectRoot, "./src/app.ts"),
		plugins: standardRollupPlugins,
		perf: true,
		cache,
		preserveEntrySignatures: "exports-only",
	});

	return rollupOptions;
};

const getRollupOutputOptions = (config: ServeConfig) => {
	const projectRoot = findRootDir();

	const outputOptionsList: RollupOutputOptions[] = [
		{
			dir: resolve(projectRoot, "./.output"),
			format: "esm",
			entryFileNames: "app.mjs",
			sourcemap: true,
			validate: true,
			generatedCode: {
				constBindings: true,
				arrowFunctions: true,
				objectShorthand: true,
			},
			freeze: true,
			compact: useProduction(true, false),
			minifyInternalExports: useProduction(true, false),
			...config.build?.output,
		},
	];

	return outputOptionsList;
};

const generateOutputs = async (bundle: RollupBuild, config: ServeConfig) => {
	// In watch mode the output options are already provided so
	// there's no real need for this but keeps everything decoupled
	const outputOptionsList: RollupOutputOptions[] =
		getRollupOutputOptions(config);

	for (const outputOptions of outputOptionsList) {
		const { output } = await bundle.write(outputOptions);

		for (const chunkOrAsset of output) {
			if (chunkOrAsset.type === "asset")
				consola.info(`Generated asset: ${chunkOrAsset.fileName}`);
			else consola.info(`Generated chunk: ${chunkOrAsset.fileName}`);
		}
	}
};

const removeOutputs = async (projectRoot: string) =>
	rm(`${projectRoot}/.output`, { recursive: true, force: true });

const clearScreen = () => {
	consola.restoreAll();
	/* eslint-disable */
	console.clear();
	consola.wrapAll();
};
