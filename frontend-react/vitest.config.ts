import { defineConfig } from "vitest/config";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
	test: {
		passWithNoTests: true,
		reporters: "verbose",
		include: ["**/spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		environment: "happy-dom",
	},
	plugins: [
		AutoImport({
			imports: ["react", "vitest"],
			dirs: ["./src/utilities", "./src/context"],
			eslintrc: {
				enabled: true,
			},
		}),
	],
});
