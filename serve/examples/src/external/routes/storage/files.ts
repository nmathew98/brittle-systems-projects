import { sendError, defineRoute, sendStream } from "@skulpture/serve";

export default defineRoute({
	route: "/storage/files/:folder/:file",
	method: ["get"],
	protected: true,
	use: async (e, useModule) => {
		const Storage = useModule("Storage");

		try {
			const stream = await Storage.stream(e.req, e.res);

			return await sendStream(e, stream);
		} catch (error: any) {
			return sendError(e, error.message, error?.statusCode);
		}
	},
});
