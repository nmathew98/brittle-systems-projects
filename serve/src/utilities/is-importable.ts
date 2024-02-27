export const isImportable = (path: string) =>
	path.includes(".js") || (path.includes(".ts") && !path.includes(".d.ts"));
