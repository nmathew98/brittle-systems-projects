import { fromNodeMiddleware } from "h3";
import cors from "cors";

import { defineMiddleware } from "../middleware";

export default defineMiddleware({
	use: config => fromNodeMiddleware(cors(config?.middleware?.cors)),
});
