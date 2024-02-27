export const delimit = (index: number, array: any[], delimiter = ", ") =>
	index === array.length - 1 ? "" : delimiter;
