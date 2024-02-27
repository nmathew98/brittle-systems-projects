// Taken from:
// https://github.com/mjackson/rollup-watch-dir

import { utimes as updateFileTimes } from "node:fs/promises";
import { watch } from "chokidar";
import { fileSync as createTmpFileSync } from "tmp";
import consola from "consola";

export const watchInput = (input: string) => {
	let startedWatcher = false;
	const tmpfile = createTmpFileSync();

	return {
		name: "watch-input",
		async buildStart() {
			const rollupContext = this as unknown as RollupContext;

			if (!startedWatcher) {
				watch(input).on("all", (_, path) => {
					// Watch the tmp file instead of the src dir...
					const watchedFiles = rollupContext.getWatchFiles();

					const NOW = new Date();

					if (!watchedFiles.includes(path))
						updateFileTimes(tmpfile.name, NOW, NOW).catch(consola.error);
				});

				startedWatcher = true;
			}

			rollupContext.addWatchFile(tmpfile.name);
		},
	};
};

interface RollupContext {
	getWatchFiles: () => string[];
	addWatchFile: (path: string) => void;
}
