export const ArticlePaginationItem = ({ isActive, onClick, children }) => (
	<li className={joinClasses(isActive, "page-item", "active")}>
		<button type="button" className="page-link" onClick={onClick}>
			{children}
		</button>
	</li>
);
