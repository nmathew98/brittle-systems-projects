import { Logger } from "../adapter/internal/logger/logger.js";
import { Stores } from "./constants.js";
import { decorateObject } from "./decorate-object.js";

export const createStore = (name: string) => {
	const proxyHandler: ProxyHandler<any> = {
		get: (target, parameter) => {
			if (parameter === "name") return name;
			else return target[parameter]?.bind(target);
		},
		set: () => true,
	};

	return new Proxy(new Map(), proxyHandler) as _Store;
};

export const moduleStore = createStore(Stores.Module);
export const schemaDefinitionStore = createStore(Stores.Schema);
const serveStore = createStore(Stores.Serve);

export const useStore = <T = any>(
	key: string | symbol,
	store = serveStore as _Store,
): [T, (value?: T) => T | null] => [
	store.get(key),
	(value?: T) => {
		if (value) {
			if (store.name === Stores.Module && store.has(key)) {
				Logger.log(`Module "${key.toString()}" already exists, composing ...`);

				const existing = store.get(key);
				const composed = decorateObject(existing, value);

				store.set(key, composed);
				return null;
			}

			store.set(key, value);
			return null;
		}

		return store.get(key);
	},
];

export type Store = <T = any>(key: string | symbol) => [T, () => T | null];
interface _Store extends Map<any, any> {
	name: string;
}
