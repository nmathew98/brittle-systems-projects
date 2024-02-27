import type { H3Event } from "h3";

export interface Authorization {
	get: (e: H3Event, options?: Record<string, any>) => Promise<any>;
	verify: (e: H3Event, options?: Record<string, any>) => Promise<any>;
}

export const SymbolAuthorization = Symbol("Authorization");
