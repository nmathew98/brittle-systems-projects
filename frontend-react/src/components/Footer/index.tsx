import { Link } from "react-router-dom";

export const Footer = () => (
	<footer>
		<div className="container">
			<Link to="/" className="logo-font">
				{BRAND_NAME}
			</Link>
			<span className="attribution">
				An interactive learning project from&nbsp;
				<a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed
				under MIT.
			</span>
		</div>
	</footer>
);
