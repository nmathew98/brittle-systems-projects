import consola from "consola";
import * as pSentry from "@sentry/node";

import { decorateObject } from "../../../utilities/decorate-object.js";
import { useProduction } from "../../../utilities/use-in.js";

export interface Logger {
	/**
	 * Print a success message
	 */
	success: (...args: string[]) => void;

	/**
	 * Log a message
	 */
	log: (...args: string[]) => void;

	/**
	 * Log an error
	 */
	error: (...args: (string | Error)[]) => Promise<void>;
}

const Sentry: Logger = {
	success: () => {
		return;
	},
	log: () => {
		return;
	},
	error: async (...args: (string | Error)[]) => {
		const currentDate = new Date();
		const name = currentDate.toDateString();

		const transaction = pSentry.startTransaction({
			op: "transaction",
			name,
		});

		args.forEach(arg => {
			if (arg instanceof Error) pSentry.captureException(arg);
			else pSentry.captureMessage(JSON.stringify(arg));
		});

		transaction.finish();
	},
};

const Consola: Logger = {
	success: (...args: string[]) => consola.success(args.join(" ")),
	log: (...args: string[]) => consola.info(args.join(" ")),
	error: async (...args: (string | Error)[]) => {
		for (const arg of args)
			if (typeof arg === "string") consola.error(arg);
			else if (arg instanceof Error) consola.error(arg.message);
	},
};

const buildLogger = () =>
	useProduction(decorateObject<Logger>(Sentry, Consola), Consola);

export default {
	name: "Logger",
	builder: buildLogger,
};

export const Logger: Logger = buildLogger();