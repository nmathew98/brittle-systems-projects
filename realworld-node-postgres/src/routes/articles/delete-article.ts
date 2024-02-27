import type { H3Event } from "h3";
import { getRouterParams, getCookie, send } from "h3";
import { z } from "h3-zod";

import { makeArticle } from "../../entities/article/create";
import { makeUser } from "../../entities/user/create";
import { deleteArticle as _deleteArticle } from "../../entities/article/delete";

export default eventHandler(async function deleteArticle(
	this: Context,
	event: H3Event,
) {
	const refreshToken = getCookie(
		event,
		AUTHENTICATION_COOKIE_KEYS.RefreshToken,
	);

	const params = PARAMS_SCHEMA.parse(getRouterParams(event));

	await pipe<typeof makeUser, typeof makeArticle>(
		makeUser,
		toPipeable<typeof _deleteArticle>(_deleteArticle, {
			slug: params.slug,
		}),
	)({ token: refreshToken });

	return send(event, null);
});

const PARAMS_SCHEMA = z.object({
	slug: ARTICLE_SCHEMA.slug,
});
