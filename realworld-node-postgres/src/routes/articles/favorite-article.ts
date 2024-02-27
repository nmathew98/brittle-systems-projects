import type { H3Event } from "h3";
import { getRouterParams, getCookie } from "h3";
import { z } from "h3-zod";

import { makeArticle } from "../../entities/article/create";
import { getArticle } from "../../entities/article/read";
import { toggleFavorite } from "../../entities/article/update/toggle-favorite";
import { makeUser } from "../../entities/user/create";

export default eventHandler(async function favoriteArticle(
	this: Context,
	event: H3Event,
) {
	const refreshToken = getCookie(
		event,
		AUTHENTICATION_COOKIE_KEYS.RefreshToken,
	);

	const params = PARAMS_SCHEMA.parse(getRouterParams(event));

	return toArticleResponse(
		await pipe<typeof makeUser, typeof makeArticle>(
			makeUser,
			toPipeable<typeof getArticle>(getArticle, {
				slug: params.slug,
			}),
			toPipeable<typeof toggleFavorite>(toggleFavorite, {
				isFavorited: true,
			}),
			toPipeable<typeof makeArticle>(makeArticle),
		)({ token: refreshToken }),
	);
});

const PARAMS_SCHEMA = z.object({
	slug: ARTICLE_SCHEMA.slug,
});
