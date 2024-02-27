import "dotenv/config";
import { initialize, start } from "@skulpture/serve";

const load = async () => {
	const serve = await initialize();

	start(serve);
};

load();
