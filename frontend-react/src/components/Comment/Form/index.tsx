import { Link } from "react-router-dom";

import { Button } from "../../Button";

export const CommentForm = ({
	id,
	onChangeComment,
	onPostComment,
	profileImage,
	profileLink,
	isLoading,
}) => (
	<form id={id} className="card comment-form">
		<div className="card-block">
			<textarea
				className="form-control"
				placeholder="Write a comment..."
				rows={3}
				onChange={onChangeComment}
				disabled={isLoading}
			/>
		</div>
		<div className="card-footer">
			<Link to={profileLink} className="comment-author">
				<img src={profileImage} className="comment-author-img" />
			</Link>
			<Button onClick={onPostComment} disabled={isLoading}>
				Post Comment
			</Button>
		</div>
	</form>
);
