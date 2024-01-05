import { LayoutBase } from "../../";

export const LayoutArticleEdit = ({ children }) => (
	<LayoutBase>
		<div className="editor-page">
			<div className="container page">
				<div className="row">
					<div className="col-md-10 offset-md-1 col-xs-12">{children}</div>
				</div>
			</div>
		</div>
	</LayoutBase>
);
