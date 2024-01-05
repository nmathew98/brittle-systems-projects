import { format } from "date-fns";
import { Link } from "react-router-dom";

import { ButtonAction } from "../../Button/Action";
import { TagContainer } from "../../Tag/Container";
import { TagOutline } from "../../Tag/Outline";

export const ArticleCard = ({
	onClickFavorite,
	profileLink,
	profileImage,
	author,
	createdAt,
	favorited,
	favoritesCount,
	articleLink,
	title,
	description,
	tags,
}: ArticleCard) => (
	<div className="article-preview">
		<div className="article-meta">
			<Link to={profileLink}>
				<img src={profileImage} />
			</Link>
			<div className="info">
				<Link to={profileLink} className="author">
					{author}
				</Link>
				<span className="date">{formatDate(createdAt)}</span>
			</div>
			<ButtonAction
				onClick={onClickFavorite}
				icon="ion-heart"
				isActive={favorited}>
				{favoritesCount}
			</ButtonAction>
		</div>
		<Link to={articleLink} className="preview-link">
			<h1>{title}</h1>
			<p>{description}</p>
			<span>Read more...</span>
			{!tags ? null : (
				<TagContainer>
					{tags?.map(tag => (
						<TagOutline key={tag}>{tag}</TagOutline>
					))}
				</TagContainer>
			)}
		</Link>
	</div>
);

interface ArticleCard {
	onClickFavorite?: () => any;
	profileLink: string;
	profileImage: string;
	author: string;
	createdAt: Date;
	favorited: boolean;
	favoritesCount: number;
	articleLink: string;
	title: string;
	description: string;
	tags: string[];
}

const formatDate = (date: Date) => format(date, "PPP");
