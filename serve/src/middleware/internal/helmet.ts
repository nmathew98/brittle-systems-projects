import type { NodeMiddleware } from "h3";
import { fromNodeMiddleware } from "h3";
import helmet from "helmet";

import { defineMiddleware } from "../middleware";

export default defineMiddleware({
	use: config =>
		fromNodeMiddleware(helmet(config?.middleware?.helmet) as NodeMiddleware),
});
