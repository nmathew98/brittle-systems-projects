import { defineConfig } from "tsup";
import AutoImport from "unplugin-auto-import/esbuild";

export default defineConfig({
	esbuildPlugins: [
		AutoImport({
			dirs: ["./src/records/**", "./src/utilities/**", "./src/types"],
			eslintrc: {
				enabled: true,
			},
			dts: "./src/auto-imports.d.ts",
		}),
	],
	clean: true,
	minifyIdentifiers: false,
	minifyWhitespace: true,
	minifySyntax: true,
	keepNames: true,
});
