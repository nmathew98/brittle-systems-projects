export const toCamelCase = (word: string) =>
	word
		.split(/(?=[A-Z])/)
		.map(camelCase)
		.join("");

const camelCase = (word: string, index: number) => {
	if (index === 0) return word.toLowerCase();
	else return `${word.charAt(0).toUpperCase()}${word.slice(1).toUpperCase()}`;
};
