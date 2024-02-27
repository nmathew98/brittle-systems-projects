import type { H3Event } from "h3";
import { getCookie, readBody } from "h3";
import { z } from "h3-zod";

import { makeArticle } from "../../entities/article/create";
import { makeUser } from "../../entities/user/create";

export default eventHandler(async function createArticle(
	this: Context,
	event: H3Event,
) {
	const refreshToken = getCookie(
		event,
		AUTHENTICATION_COOKIE_KEYS.RefreshToken,
	);

	const body = BODY_SCHEMA.parse(await readBody(event));

	return toArticleResponse(
		await pipe<typeof makeUser, typeof makeArticle>(
			makeUser,
			toPipeable<typeof makeArticle>(makeArticle, body.article),
		)({ token: refreshToken }),
	);
});

const BODY_SCHEMA = z.object({
	article: z.object({
		title: ARTICLE_SCHEMA.title,
		description: ARTICLE_SCHEMA.description,
		body: ARTICLE_SCHEMA.body,
		tagList: ARTICLE_SCHEMA.tagList,
	}),
});
