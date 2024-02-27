import type { H3Event } from "h3";
import { getRouterParams, getCookie, send } from "h3";
import { z } from "h3-zod";

import { unfollowUser as _unfollowUser } from "../../entities/user/delete";
import { makeUser } from "../../entities/user/create";

export default eventHandler(async function unfollowUser(
	this: Context,
	event: H3Event,
) {
	const refreshToken = getCookie(
		event,
		AUTHENTICATION_COOKIE_KEYS.RefreshToken,
	);

	const params = PARAMS_SCHEMA.parse(getRouterParams(event));

	await pipe<typeof makeUser, typeof _unfollowUser>(
		makeUser,
		toPipeable<typeof _unfollowUser>(_unfollowUser, {
			username: params.username,
		}),
	)({ token: refreshToken });

	return send(event, null);
});

const PARAMS_SCHEMA = z.object({
	username: USER_SCHEMA.username,
});
