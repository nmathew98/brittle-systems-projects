import { defineServeConfig } from "@skulpture/serve";
import { Schema } from "mongoose";

export default defineServeConfig({
	server: {
		sentry: {
			dsn: "",
			tracesSampleRate: 1.0,
		},
	},
	middleware: {
		cors: {
			origin: (origin, callback): any => {
				if (!origin) callback(null, false);

				const allowedOrigins: string[] = ["http://localhost:3000"];
				if (allowedOrigins.includes(origin as string))
					return callback(null, origin);

				callback(null, false);
			},
			credentials: true,
		},
	},
	modules: {
		user: {
			model: "User",
			schema: new Schema({
				uuid: {
					type: String,
					required: true,
					unique: true,
				},
				email: {
					type: String,
					required: true,
					unique: true,
				},
				password: {
					type: String,
					required: true,
				},
				puzzle: {
					type: [String],
					required: true,
				},
			}),
		},
	},
});
