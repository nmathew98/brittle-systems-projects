import { eventHandler } from "h3";

import type { Authorization } from "../../adapter/types/authorization/authorization";
import { SymbolAuthorization } from "../../adapter/types/authorization/authorization";
import { sendError } from "../../route/utilities";
import { defineMiddleware } from "../middleware";

export default defineMiddleware({
	protected: true,
	use: (config, useModule) =>
		eventHandler(async e => {
			const Authorization: Authorization = useModule(SymbolAuthorization);

			if (!Authorization) return;

			try {
				await Authorization.verify(e, config?.modules?.SymbolAuthorization);
			} catch (error: any) {
				return sendError(e, error.message, 401);
			}

			return;
		}),
});
