#!/usr/bin/env node

import { build, watch } from "../dist/build/build.js";
import { config } from "../dist/utilities/config.js";

const args = process.argv.slice(2);

const scriptName = args[0]?.toLowerCase();

const loadScript = async () => {
	const c = await config();
	const nodeArgs = args.slice(1);

	switch (scriptName) {
		case "build": {
			await build(c, nodeArgs);
			break;
		}
		case "watch": {
			await watch(c, nodeArgs);
			break;
		}
		default:
			break;
	}
};

loadScript();
