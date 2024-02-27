import { z } from "h3-zod";

export const AUTHENTICATION_COOKIE_KEYS = {
	AccessToken: "access",
	RefreshToken: "refresh",
};

export const USER_SCHEMA = {
	email: z.string().email().min(10).max(320),
	password: z.string().min(5).max(12),
	username: z.string().min(5).max(20),
	bio: z.string(),
	image: z.string().max(2048),
};

export const ARTICLE_SCHEMA = {
	slug: z.string(),
	title: z.string(),
	description: z.string(),
	body: z.string(),
	tagList: z.array(z.string()),
	limit: z.number(),
	offset: z.number(),
};

export const COMMENTS_SCHEMA = {
	uuid: z.string(),
	slug: z.string(),
	body: z.string(),
};
