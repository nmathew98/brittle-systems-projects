import { promisify } from "node:util";
import bcrypt from "bcryptjs";

export const Hasher = {
	hash: (value: string) => promisify(bcrypt.hash)(value, 12),
	verify: promisify(bcrypt.compare),
};
