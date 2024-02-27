import { promisify } from "node:util";
import jwt from "jsonwebtoken";
import { readFileSync } from "node:fs";

if (!process.env.JWT_ACCESS_EXPIRES)
	throw new Error("Environment variable `JWT_ACCESS_EXPIRES` is not defined");
if (!process.env.JWT_REFRESH_EXPIRES)
	throw new Error("Environment variable `JWT_REFRESH_EXPIRES` is not defined");
if (!process.env.JWT_ACCESS_SECRET_FILE)
	throw new Error(
		"Environment variable `JWT_ACCESS_SECRET_FILE` is not defined",
	);
if (!process.env.JWT_REFRESH_SECRET_FILE)
	throw new Error(
		"Environment variable `JWT_REFRESH_SECRET_FILE` is not defined",
	);
if (!process.env.JWT_INTERNAL_SECRET_FILE)
	throw new Error(
		"Environment variable `JWT_REFRESH_SECRET_FILE` is not defined",
	);

process.env.JWT_ACCESS_SECRET = readFileSync(
	process.env.JWT_ACCESS_SECRET_FILE,
).toString();
process.env.JWT_REFRESH_SECRET = readFileSync(
	process.env.JWT_REFRESH_SECRET_FILE,
).toString();
process.env.JWT_INTERNAL_SECRET = readFileSync(
	process.env.JWT_INTERNAL_SECRET_FILE,
).toString();

export const Jwt = {
	verify: promisify(jwt.verify),
	sign: promisify(jwt.sign),
};
