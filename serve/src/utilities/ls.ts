import { opendir } from "node:fs/promises";
import { join } from "node:path";

import consola from "consola";

export async function* ls(root: string): AsyncGenerator<string> {
	try {
		for await (const child of await opendir(root)) {
			const entry = join(root, child.name);
			if (child.isDirectory()) yield* ls(entry);
			else if (child.isFile()) yield entry;
		}
	} catch (error: any) {
		consola.warn(`Skipping ${root}`);
	}
}
