import type { H3Event } from "h3";
import { getCookie } from "h3";
import { zh } from "h3-zod";

import { makeUser } from "../../entities/user/create";
import { getArticles } from "../../entities/article/read";

export default eventHandler(async function feedArticle(
	this: Context,
	event: H3Event,
) {
	const refreshToken = getCookie(
		event,
		AUTHENTICATION_COOKIE_KEYS.RefreshToken,
	);

	const params = (await zh.useValidatedParams(event, {
		limit: ARTICLE_SCHEMA.limit.optional(),
		offset: ARTICLE_SCHEMA.offset.optional(),
	})) as { limit?: number; offset?: number };

	if (!refreshToken) return toFeedResponse(await getArticles.call(this));

	return toFeedResponse(
		await pipe<typeof makeUser, typeof getArticles>(
			makeUser,
			toPipeable<typeof getArticles>(getArticles, {
				limit: params.limit,
				offset: params.offset,
			}),
		)({ token: refreshToken }),
	);
});
