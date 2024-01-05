import { STORAGE_KEYS } from "../utilities/constants";
import { HTTPError } from "./errors";

const API_BASE = import.meta.env.API ?? "https://api.realworld.io/api";

const _fetch =
	(
		url: string,
		method: string,
		unwrap?: ((o: Record<string, any>) => Record<string, any>) | null,
		params?: Record<string, any> | null,
	) =>
	async ({ body }) => {
		const token = !import.meta.env.API
			? window.localStorage.getItem(STORAGE_KEYS.Token)
			: null;

		const validSearchParams = Object.entries(
			params ?? Object.create(null),
		).filter(([, value]) => !!value) as string[][];

		const searchParams = new URLSearchParams(
			Object.fromEntries(validSearchParams),
		).toString();

		const headers = new Headers();
		if (token) headers.append("Authorization", `Token ${token}`);
		if (body) headers.append("Content-Type", "application/json");

		const resource = `${API_BASE}${url}`.concat(
			searchParams ? `?${searchParams}` : "",
		);

		const response = await fetch(resource, {
			method,
			body: method === "GET" ? null : JSON.stringify(body),
			headers,
		});

		const result = response.status === 200 ? await response.json() : null;

		if (result?.errors)
			throw new AggregateError(Object.entries(result?.errors));
		if (!response.ok || !(response.status >= 200 && response.status <= 299))
			throw new HTTPError(response);

		const unwrapped = unwrap?.(result) ?? result;

		return unwrapped;
	};

const unwrapAuthResult = (result: Record<string, any>) => result?.user ?? null;
const unwrapProfileResult = (result: Record<string, any>) =>
	result?.profile ?? null;
const unwrapArticlesResult = (result: Record<string, any>) =>
	result?.articles ?? result?.article ?? null;
const unwrapCommentsResult = (result: Record<string, any>) =>
	result?.comments ?? null;
const unwrapTagsResult = (result: Record<string, any>) => result?.tags ?? null;

// Docs: https://api.realworld.io/api-docs/#/
export const Resources = Object.freeze({
	Auth: {
		read: {
			verify: _fetch("/auth", "GET"),
		},
	},
	User: {
		create: _fetch("/users", "POST", unwrapAuthResult),
		read: {
			login: _fetch("/users/login", "POST", unwrapAuthResult),
			username: ({ username }) =>
				_fetch(`/profiles/${username}`, "GET", unwrapProfileResult),
			current: _fetch("/user", "GET", unwrapAuthResult),
		},
		update: {
			profile: _fetch("/user", "PUT", unwrapAuthResult),
			follow: ({ username }) =>
				_fetch(`/profiles/${username}/follow`, "POST", unwrapProfileResult),
			unfollow: ({ username }) =>
				_fetch(`/profiles/${username}/follow`, "DELETE", unwrapProfileResult),
		},
	},
	Articles: {
		create: _fetch("/articles", "POST", unwrapArticlesResult),
		read: {
			single: ({ slug }) =>
				_fetch(`/articles/${slug}`, "GET", unwrapArticlesResult),
			followers: ({ limit, offset }) =>
				_fetch("/articles/feed", "GET", null, {
					limit,
					offset,
				}),
			global: ({ tag, author, favorited, limit, offset }) =>
				_fetch("/articles", "GET", null, {
					tag,
					author,
					favorited,
					limit,
					offset,
				}),
		},
		update: {
			article: ({ slug }) =>
				_fetch(`/articles/${slug}`, "PUT", unwrapArticlesResult),
			favorite: ({ slug }) =>
				_fetch(`/articles/${slug}/favorite`, "POST", unwrapArticlesResult),
		},
		delete: {
			article: ({ slug }) => _fetch(`/articles/${slug}`, "DELETE"),
			favorite: ({ slug }) =>
				_fetch(`/articles/${slug}/favorite`, "DELETE", unwrapArticlesResult),
		},
	},
	Comments: {
		create: ({ slug }) =>
			_fetch(`/articles/${slug}/comments`, "POST", unwrapCommentsResult),
		read: ({ slug }) =>
			_fetch(`/articles/${slug}/comments`, "GET", unwrapCommentsResult),
		delete: ({ slug, id }) =>
			_fetch(
				`/articles/${slug}/comments/${id}`,
				"DELETE",
				unwrapCommentsResult,
			),
	},
	Tags: {
		read: _fetch("/tags", "GET", unwrapTagsResult),
	},
});
