import { ArticleActionBar } from "../ActionBar";

export const ArticleHeader = ({
	onClickFavorite,
	onClickFollowAuthor,
	onClickEditArticle,
	onClickDeleteArticle,
	title,
	profileImage,
	profileLink,
	author,
	createdAt,
	favoritesCount,
	isAuthor,
	isFollowingAuthor,
	isLoadingFavoriteArticle,
	isLoadingDeleteArticle,
	isLoadingFollowAuthor,
}: ArticleHeaderProps) => (
	<>
		<h1>{title}</h1>
		<div className="article-meta">
			<ArticleActionBar
				onClickFollowAuthor={onClickFollowAuthor}
				onClickFavorite={onClickFavorite}
				onClickEditArticle={onClickEditArticle}
				onClickDeleteArticle={onClickDeleteArticle}
				profileLink={profileLink}
				profileImage={profileImage}
				author={author}
				createdAt={createdAt}
				favoritesCount={favoritesCount}
				isAuthor={isAuthor}
				isFollowingAuthor={isFollowingAuthor}
				isLoadingFavoriteArticle={isLoadingFavoriteArticle}
				isLoadingDeleteArticle={isLoadingDeleteArticle}
				isLoadingFollowAuthor={isLoadingFollowAuthor}
			/>
		</div>
	</>
);

interface ArticleHeaderProps {
	onClickFavorite?: () => any;
	onClickFollowAuthor?: () => any;
	onClickEditArticle?: () => any;
	onClickDeleteArticle?: () => any;
	title: string;
	profileImage: string;
	profileLink: string;
	author: string;
	createdAt: Date;
	favoritesCount: number;
	isAuthor?: boolean;
	isFollowingAuthor?: boolean;
	isLoadingFavoriteArticle?: boolean;
	isLoadingDeleteArticle?: boolean;
	isLoadingFollowAuthor?: boolean;
}
