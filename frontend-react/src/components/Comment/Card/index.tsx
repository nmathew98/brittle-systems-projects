import { Link } from "react-router-dom";
import { format } from "date-fns";

import { Icon } from "../../Icon";

export const CommentCard = ({
	text,
	profileLink,
	profileImage,
	author,
	createdAt,
	onClickEdit,
	onClickDelete,
	isAuthor,
}: CommentCardProps) => (
	<div className="card">
		<div className="card-block">
			<p className="card-text">{text}</p>
		</div>
		<div className="card-footer">
			<Link to={profileLink} className="comment-author">
				<img src={profileImage} className="comment-author-img" />
			</Link>
			&nbsp;
			<Link to={profileLink} className="comment-author">
				{author}
			</Link>
			<span className="date-posted">{formatDate(createdAt)}</span>
			{!(!!isAuthor && (onClickEdit || onClickDelete)) ? null : (
				<span className="mod-options">
					{onClickEdit && (
						<button onClick={onClickEdit}>
							<Icon name="ion-edit" />
						</button>
					)}
					{onClickDelete && (
						<span onClick={onClickDelete}>
							<Icon name="ion-trash-a" />
						</span>
					)}
				</span>
			)}
		</div>
	</div>
);

interface CommentCardProps {
	text: string;
	profileLink: string;
	profileImage: string;
	author: string;
	createdAt: Date;
	onClickEdit?: () => any;
	onClickDelete?: () => any;
	isAuthor?: boolean;
}

const formatDate = (date: Date) => format(date, "PPP");
