import type { H3Event } from "h3";
import { getCookie } from "h3";

import { makeUser } from "../../entities/user/create";
import { getProfile } from "../../entities/user/read";

export default eventHandler(async function currentUser(
	this: Context,
	event: H3Event,
) {
	const refreshToken = getCookie(
		event,
		AUTHENTICATION_COOKIE_KEYS.RefreshToken,
	);

	return toUserResponse(
		await pipe<typeof makeUser, typeof getProfile>(
			makeUser,
			toPipeable<typeof getProfile>(getProfile, {
				username: null,
			}),
		)({ token: refreshToken }),
	);
});
