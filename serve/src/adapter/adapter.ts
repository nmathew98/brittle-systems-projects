import type { ServeConfig } from "../serve/serve.js";

import { Logger } from "./internal/logger/logger.js";
import { moduleStore, useStore } from "../utilities/store.js";

export const defineAdapter =
	(adapter: Adapter) => async (config: Partial<ServeConfig>) => {
		if (!adapter.name || !adapter.builder) {
			Logger.error(`❌ Invalid adapter`);

			return;
		}

		const adapterName = adapter.name;

		const [, setAdapter] = useStore(adapterName, moduleStore);

		setAdapter(adapter.builder(config));

		Logger.success(`✅ Loaded adapter ${adapterName.toString()}`);
	};

export interface Adapter {
	name: string | symbol;
	builder: AdapterBuilder;
}

type AdapterBuilder = (config: Partial<ServeConfig>) => Record<string, any>;
