import { mkdir, stat } from "node:fs/promises";

export const createFolder = (path: string) =>
	stat(path).catch(() => mkdir(path, { recursive: true }));
