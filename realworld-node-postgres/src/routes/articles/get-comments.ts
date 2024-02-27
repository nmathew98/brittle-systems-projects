import type { H3Event } from "h3";
import { getRouterParams, getCookie } from "h3";
import { z } from "h3-zod";

import { makeUser } from "../../entities/user/create";
import { getComments as _getComments } from "../../entities/comment/read";
import { getArticle } from "../../entities/article/read";

export default eventHandler(async function getComments(
	this: Context,
	event: H3Event,
) {
	const refreshToken = getCookie(
		event,
		AUTHENTICATION_COOKIE_KEYS.RefreshToken,
	);

	const params = PARAMS_SCHEMA.parse(getRouterParams(event));

	return toCommentsResponse(
		await pipe<typeof makeUser, typeof _getComments>(
			makeUser,
			toPipeable<typeof getArticle>(getArticle, {
				slug: params.slug,
			}),
			toPipeable<typeof _getComments>(_getComments),
		)({ token: refreshToken }),
	);
});

const PARAMS_SCHEMA = z.object({
	slug: ARTICLE_SCHEMA.slug,
});
