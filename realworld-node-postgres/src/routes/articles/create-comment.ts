import { getRouterParams, H3Event } from "h3";
import { getCookie, readBody } from "h3";
import { z } from "h3-zod";

import { getArticle } from "../../entities/article/read";
import { makeUser } from "../../entities/user/create";
import { makeComment } from "../../entities/comment/create";
import { toCommentResponse } from "../../records/comment";

export default eventHandler(async function createComment(
	this: Context,
	event: H3Event,
) {
	const refreshToken = getCookie(
		event,
		AUTHENTICATION_COOKIE_KEYS.RefreshToken,
	);

	const params = PARAMS_SCHEMA.parse(getRouterParams(event));
	const body = BODY_SCHEMA.parse(await readBody(event));

	return toCommentResponse(
		await pipe<typeof makeUser, typeof makeComment>(
			makeUser,
			toPipeable(getArticle, { slug: params.slug }),
			toPipeable(makeComment, {
				body: body.comment.body,
			}),
		)({ token: refreshToken }),
	);
});

const PARAMS_SCHEMA = z.object({
	slug: ARTICLE_SCHEMA.slug,
});

const BODY_SCHEMA = z.object({
	comment: z.object({
		body: COMMENTS_SCHEMA.body,
	}),
});
