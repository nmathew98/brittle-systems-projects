import type { H3Event } from "h3";
import { getRouterParams, getCookie } from "h3";
import { z } from "h3-zod";

import { makeArticle } from "../../entities/article/create";
import { makeUser } from "../../entities/user/create";

export default eventHandler(async function getArticle(
	this: Context,
	event: H3Event,
) {
	const refreshToken = getCookie(
		event,
		AUTHENTICATION_COOKIE_KEYS.RefreshToken,
	);

	const params = PARAMS_SCHEMA.parse(getRouterParams(event));

	if (!refreshToken)
		return toArticleResponse(await makeArticle.call(this, params));

	return toArticleResponse(
		await pipe<typeof makeUser, typeof makeArticle>(
			makeUser,
			toPipeable<typeof makeArticle>(makeArticle, {
				slug: params.slug,
			}),
		)({ token: refreshToken }),
	);
});

const PARAMS_SCHEMA = z.object({
	slug: ARTICLE_SCHEMA.slug,
});
