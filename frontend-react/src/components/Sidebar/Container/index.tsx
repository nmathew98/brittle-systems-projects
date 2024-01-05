export const SidebarContainer = ({ title, children }) => (
	<div className="sidebar">
		<p>{title}</p>
		{children}
	</div>
);
