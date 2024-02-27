import { stat } from "node:fs/promises";

export const isPathValid = (path: string) =>
	stat(path)
		.then(() => true)
		.catch(() => false);
