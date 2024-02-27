import type { H3Event } from "h3";
import { getCookie, getRouterParams, readBody } from "h3";
import { z } from "h3-zod";

import { makeArticle } from "../../entities/article/create";
import { updateArticle as _updateArticle } from "../../entities/article/update";
import { makeTag } from "../../entities/tag/create";
import { makeUser } from "../../entities/user/create";

export default eventHandler(async function updateArticle(
	this: Context,
	event: H3Event,
) {
	const refreshToken = getCookie(
		event,
		AUTHENTICATION_COOKIE_KEYS.RefreshToken,
	);

	const params = PARAMS_SCHEMA.parse(getRouterParams(event));
	const body = BODY_SCHEMA.parse(await readBody(event));

	const updates = {
		title: body.article.title,
		body: body.article.body,
		description: body.article.description,
		tagList: body.article.tagList,
	};

	if (Object.keys(updates).length === 0)
		return toArticleResponse(
			await pipe<typeof makeUser, typeof makeArticle>(
				makeUser,
				toPipeable<typeof makeArticle>(makeArticle, params),
			)({ token: refreshToken }),
		);

	return toArticleResponse(
		await pipe<typeof makeUser, typeof makeArticle>(
			makeUser,
			toPipeable<typeof _updateArticle>(_updateArticle, {
				slug: params.slug,
				...updates,
			}),
			toPipeable<typeof makeTag>(makeTag),
			toPipeable<typeof makeArticle>(makeArticle),
		)({ token: refreshToken }),
	);
});

const PARAMS_SCHEMA = z.object({
	slug: ARTICLE_SCHEMA.slug,
});

const BODY_SCHEMA = z.object({
	article: z.object({
		title: ARTICLE_SCHEMA.title.optional(),
		description: ARTICLE_SCHEMA.description.optional(),
		body: ARTICLE_SCHEMA.body.optional(),
		tagList: ARTICLE_SCHEMA.tagList.optional(),
	}),
});
