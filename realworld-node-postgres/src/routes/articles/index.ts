import { createRouter } from "h3";

import createArticle from "./create-article";
import createComment from "./create-comment";
import deleteArticle from "./delete-article";
import deleteComment from "./delete-comment";
import favoriteArticle from "./favorite-article";
import feedArticle from "./feed-article";
import getArticle from "./get-article";
import getComments from "./get-comments";
import unfavoriteArticle from "./unfavorite-article";
import updateArticle from "./update-article";

export const Articles = createRouter()
	.get("/articles/feed", feedArticle)
	.get("/articles/:slug", getArticle)
	.get("/articles/:slug/comments", getComments)
	.post("/articles", createArticle)
	.post("/articles/:slug/comments", createComment)
	.post("/articles/:slug", updateArticle)
	.post("/articles/:slug/favorite", favoriteArticle)
	.delete("/articles/:slug", deleteArticle)
	.delete("/articles/:slug/comments/:uuid", deleteComment)
	.delete("/articles/:slug/favorite", unfavoriteArticle);
