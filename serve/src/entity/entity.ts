import type { ServeConfig } from "../serve/serve";

import { Logger } from "../adapter/internal/logger/logger";
import { moduleStore, useStore } from "../utilities/store";
import { toCamelCase } from "../utilities/to-camel-case";

export const defineEntity =
	(entity: Entity) => async (config: Pick<ServeConfig, "modules">) => {
		if (!entity.name || !entity.builder) {
			Logger.error(`❌ Invalid entity`);

			return;
		}

		const entityName = entity.name;

		const [, setEntity] = useStore(entityName, moduleStore);

		const intermediate = entity.builder(
			Object.freeze({
				map: moduleStore,
				...Object.fromEntries(moduleStore),
			}),
		);
		if (typeof intermediate === "function")
			setEntity(intermediate(config?.modules?.[toCamelCase(entityName)]));
		else setEntity(intermediate);

		Logger.success(`✅ Loaded entity ${entityName}`);
	};

export interface Entity {
	name: string;
	builder: EntityBuilder;
}

type EntityBuilder = (
	deps: Record<string, any>,
) =>
	| ((configuration?: Record<string, any>) => Record<string, any>)
	| Record<string, any>;
