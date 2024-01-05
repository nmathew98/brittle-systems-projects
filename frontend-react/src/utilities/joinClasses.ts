export const joinClasses = (condition: boolean, ...classes: string[]) =>
	condition ? classes.join(" ") : classes[0];
