import { Markdown } from "../../Markdown";
import { TagContainer } from "../../Tag/Container";
import { TagOutline } from "../../Tag/Outline";

export const ArticleContent = ({ text, tags }) => (
	<div className="col-md-12">
		<Markdown>{text}</Markdown>
		<TagContainer>
			{tags?.map(tag => (
				<TagOutline key={tag}>{tag}</TagOutline>
			))}
		</TagContainer>
	</div>
);
