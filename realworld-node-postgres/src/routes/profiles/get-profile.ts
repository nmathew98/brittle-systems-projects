import type { H3Event } from "h3";
import { getRouterParams, getCookie } from "h3";
import { z } from "h3-zod";

import { makeUser } from "../../entities/user/create";
import { getProfile as _getProfile } from "../../entities/user/read";

export default eventHandler(async function getProfile(
	this: Context,
	event: H3Event,
) {
	const refreshToken = getCookie(
		event,
		AUTHENTICATION_COOKIE_KEYS.RefreshToken,
	);

	const params = PARAMS_SCHEMA.parse(getRouterParams(event));

	if (!refreshToken)
		return toProfileResponse(await _getProfile.call(this, params));

	return toProfileResponse(
		await pipe<typeof makeUser, typeof _getProfile>(
			makeUser,
			toPipeable<typeof _getProfile>(_getProfile, {
				username: params.username,
			}),
		)({ token: refreshToken }),
	);
});

const PARAMS_SCHEMA = z.object({
	username: USER_SCHEMA.username,
});
