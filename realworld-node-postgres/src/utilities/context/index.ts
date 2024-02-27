import pg from "pg";
import consola from "consola";

import { Hasher } from "./hasher";
import { Jwt } from "./jwt";

if (
	!process.env.POSTGRES_USER ||
	!process.env.POSTGRES_PASSWORD ||
	!process.env.POSTGRES_DB
)
	throw new Error(
		"Environment variables `POSTGRES_DB`, `POSTGRES_PASSWORD` and `POSTGRES_USER` must be specified",
	);

export const createContext = async () => {
	const client = new pg.Client({
		host: process.env.POSTGRES_HOST ?? "postgres",
		database: process.env.POSTGRES_DB,
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		ssl: true
	});

	try {
		await client.connect();
		consola.success(
			`[postgres] connected as ${process.env.POSTGRES_USER} to database ${process.env.POSTGRES_DB}`,
		);
	} catch (error: any) {
		consola.error(`[postgres] failed to connect as ${process.env.POSTGRES_USER} to database ${process.env.POSTGRES_DB}`);

		consola.error(`[postgres] error: ${JSON.stringify(error, null, 2)}`);
	}

	return Object.freeze({
		pg: client,
		hasher: Hasher,
		jwt: Jwt,
	});
};

export const CONTEXT = await createContext();
