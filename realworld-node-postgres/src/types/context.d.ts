export {};

declare global {
	interface Context {
		pg: any;
		hasher: any;
		jwt: any;
	}
}
