import type { H3Event } from "h3";
import { getRouterParams, getCookie, send } from "h3";
import { z } from "h3-zod";

import { followUser as _followUser } from "../../entities/user/update";
import { makeUser } from "../../entities/user/create";

export default eventHandler(async function followUser(
	this: Context,
	event: H3Event,
) {
	const refreshToken = getCookie(
		event,
		AUTHENTICATION_COOKIE_KEYS.RefreshToken,
	);

	const params = PARAMS_SCHEMA.parse(getRouterParams(event));

	await pipe<typeof makeUser, typeof _followUser>(
		makeUser,
		toPipeable<typeof _followUser>(_followUser, {
			username: params.username,
		}),
	)({ token: refreshToken });

	return send(event, null);
});

const PARAMS_SCHEMA = z.object({
	username: USER_SCHEMA.username,
});
