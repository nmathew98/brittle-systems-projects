import { defineRoute, deleteCookie, sendSuccess } from "@skulpture/serve";

export default defineRoute({
	route: "/auth/logout",
	method: ["delete"],
	use: async e => {
		deleteCookie(e, "authorization");
		deleteCookie(e, "refresh");

		return sendSuccess(e, "Log out successful");
	},
});
