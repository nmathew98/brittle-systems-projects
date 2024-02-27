import type { H3Event } from "h3";
import { getRouterParams, getCookie, send } from "h3";
import { z } from "h3-zod";

import { makeArticle } from "../../entities/article/create";
import { makeUser } from "../../entities/user/create";
import { getArticle } from "../../entities/article/read";
import { deleteComment as _deleteComment } from "../../entities/comment/delete";

export default eventHandler(async function deleteComment(
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
		toPipeable<typeof getArticle>(getArticle, {
			slug: params.slug,
		}),
		toPipeable<typeof _deleteComment>(_deleteComment, {
			uuid: params.uuid,
		}),
	)({ token: refreshToken });

	return send(event, null);
});

const PARAMS_SCHEMA = z.object({
	slug: ARTICLE_SCHEMA.slug,
	uuid: COMMENTS_SCHEMA.uuid,
});
