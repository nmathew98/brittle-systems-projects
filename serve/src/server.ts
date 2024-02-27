import "@sentry/tracing";
import * as Sentry from "@sentry/node";

import type { Serve, ServeConfig, ServeInitConfig } from "./serve/serve";
import { createServe } from "./serve/serve";
import { config } from "./utilities/config";
import { initializeFragments } from "./utilities/vm";

export const initialize = async (init?: ServeInitConfig) => {
	const c = (await config()) as ServeConfig;

	if (c?.server?.sentry) Sentry.init(c?.server?.sentry);

	const serve = createServe(c);

	await initializeFragments(serve);

	serve.initialize(init);

	return serve;
};

// This is for Node
export const start = (serve: Promise<Serve> | Serve) => {
	if ((serve as Promise<Serve>).then)
		(serve as Promise<Serve>).then(s => s.listen());
	else (serve as Serve).listen();
};

// This is for Bun, in `app.ts`
/*export default {
	port: process.env.PORT || 3000,
	fetch: (event: CompatibilityEvent) => serve.listen(event),
};*/

// This is for CloudFlare Workers, in `app.ts`
/*if (navigator.serviceWorker && !process) {
	addEventListener('fetch', (event: any) => serve.listen(event))
}*/
