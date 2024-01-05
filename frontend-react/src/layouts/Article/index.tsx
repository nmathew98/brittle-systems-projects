import { LayoutBase } from "../";
import { CommentContainer } from "../../components/Comment/Container";

export const LayoutArticle = ({ children }) => (
	<LayoutBase>
		<div className="article-page">
			<div className="banner">
				<div className="container">{children?.[0]}</div>
			</div>
			<div className="container page">
				<div className="row article-content">{children?.[4]}</div>

				<hr />

				<div className="article-actions">
					<div className="article-meta">{children?.[1]}</div>
				</div>

				<div className="row">
					<CommentContainer>
						{children?.[2]}
						{children?.[3]}
					</CommentContainer>
				</div>
			</div>
		</div>
	</LayoutBase>
);
