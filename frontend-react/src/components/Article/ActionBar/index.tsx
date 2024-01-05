import { format } from "date-fns";
import { Link } from "react-router-dom";

import { ButtonAction } from "../../Button/Action";

export const ArticleActionBar = ({
	onClickFollowAuthor,
	onClickFavorite,
	onClickEditArticle,
	onClickDeleteArticle,
	profileLink,
	profileImage,
	author,
	createdAt,
	favoritesCount,
	isAuthor,
	isFollowingAuthor,
	isLoadingFavoriteArticle,
	isLoadingDeleteArticle,
	isLoadingFollowAuthor,
}: ArticleActionBarProps) => (
	<>
		<Link to={profileLink}>
			<img src={profileImage} />
		</Link>
		<div className="info">
			<Link to={profileLink} className="author">
				{author}
			</Link>
			<span className="date">{formatDate(createdAt)}</span>
		</div>
		{isAuthor ? null : (
			<>
				<ButtonAction
					type="secondary"
					icon="ion-plus-round"
					onClick={onClickFollowAuthor}
					disabled={isLoadingFollowAuthor}>
					{isFollowingAuthor ? `Unfollow ${author}` : `Follow ${author}`}
				</ButtonAction>
				&nbsp;
				<ButtonAction
					type="primary"
					icon="ion-heart"
					onClick={onClickFavorite}
					disabled={isLoadingFavoriteArticle}>
					Favorite Article <span className="counter">({favoritesCount})</span>
				</ButtonAction>
			</>
		)}
		{!isAuthor ? null : (
			<>
				<ButtonAction
					type="secondary"
					icon="ion-edit"
					onClick={onClickEditArticle}>
					Edit Article
				</ButtonAction>
				&nbsp;
				<ButtonAction
					type="danger"
					icon="ion-trash-a"
					onClick={onClickDeleteArticle}
					disabled={isLoadingDeleteArticle}>
					Delete Article
				</ButtonAction>
			</>
		)}
	</>
);

interface ArticleActionBarProps {
	onClickFollowAuthor?: () => any;
	onClickFavorite?: () => any;
	onClickEditArticle?: () => any;
	onClickDeleteArticle?: () => any;
	profileLink: string;
	profileImage: string;
	author: string;
	createdAt: Date;
	favoritesCount: number;
	isAuthor?: boolean;
	isFollowingAuthor?: boolean;
	isLoadingFavoriteArticle?: boolean;
	isLoadingDeleteArticle?: boolean;
	isLoadingFollowAuthor?: boolean;
}

const formatDate = (date: Date) => format(date, "PPP");
