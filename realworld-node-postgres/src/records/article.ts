import { formatISO } from "date-fns";

import { Collection } from ".";

export class Article extends Collection {
	public slug: string;
	public uuid: string | null = null;
	public author: string | null = null;
	public title: string | null = null;
	public description: string | null = null;
	public body: string | null = null;
	public createdAt: Date | null = null;
	public updatedAt: Date | null = null;
	public tags: string[] | null = null;
	public isFavorited: boolean | null = null;
	public isFollowing: boolean | null = null;
	public favoritesCount: number | null = null;
	public username: string | null = null;
	public bio: string | null = null;
	public image: string | null = null;
	public articles_count: number | null = null;

	constructor(data: ArticleDBSchema) {
		super();

		this.slug = data.slug;
		this.uuid = data.uuid || null;
		this.author = data.author || null;
		this.title = data.title || null;
		this.description = data.description || null;
		this.body = data.body || null;
		this.tags = data.tags || null;
		this.isFavorited = data.is_favorited || null;
		this.favoritesCount = Number(data.favorites_count) || null;
		this.username = data.username || null;
		this.bio = data.bio || null;
		this.image = data.image || null;
		this.isFollowing = data.is_following || null;
		this.articles_count = Number(data.articles_count) || null;

		const createdAt = Number(data.created_at);
		const updatedAt = Number(data.updated_at);

		this.createdAt = createdAt ? new Date(createdAt) : null;
		this.updatedAt = updatedAt ? new Date(updatedAt) : null;
	}
}

export const toArticleResponse = (article: InstanceType<typeof Article>) => ({
	article: {
		slug: article.slug,
		title: article.title,
		description: article.description,
		body: article.body,
		tagList: article.tags || [],
		createdAt: article.createdAt ? formatISO(article.createdAt) : null,
		updatedAt: article.updatedAt ? formatISO(article.updatedAt) : null,
		favorited: !!article.isFavorited,
		favoritesCount: article.favoritesCount || 0,
		author: {
			username: article.username,
			bio: article.bio,
			image: article.image,
			following: !!article.isFollowing,
		},
	},
});

export const toFeedResponse = (articles: InstanceType<typeof Article>[]) => ({
	articles: articles.map(article => toArticleResponse(article).article),
	articlesCount:
		(articles.at(0) as InstanceType<typeof Article>)?.articles_count ?? 0,
});

interface ArticleDBSchema {
	slug: string;
	uuid?: string;
	author?: string;
	title?: string;
	description?: string;
	body?: string;
	created_at?: number;
	updated_at?: number;
	tags?: string[];
	is_favorited?: boolean | null;
	is_following?: boolean | null;
	favorites_count?: number;
	username?: string;
	bio?: string;
	image?: null;
	articles_count?: number;
}
