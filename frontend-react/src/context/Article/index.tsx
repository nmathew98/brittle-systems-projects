import React from "react";

import type { User } from "../User";

export interface Feed {
	articles: Article[];
	articlesCount: number;
}

export interface Article {
	slug: string;
	title: string;
	description: string;
	body: string;
	tagList: string[];
	createdAt: string;
	updatedAt: string;
	favourited: boolean;
	favouritesCount: number;
	author: User;
}

export const ArticleContext = React.createContext(Object.create(null));

export const ArticleProvider = ({ children }) => {
	const getAllFollowerArticles = Resources.Articles.read.followers;
	const getAllGlobalArticles = Resources.Articles.read.global;

	const getTags = Resources.Tags.read;

	return (
		<ArticleContext.Provider
			value={{
				getAllFollowerArticles,
				getAllGlobalArticles,
				getTags,
				transformArticle,
			}}>
			{children}
		</ArticleContext.Provider>
	);
};

const transformArticle = article => ({
	...article,
	createdAt: new Date(article.createdAt),
	updatedAt: new Date(article.updatedAt),
});
