export const ButtonOutline = ({
	type = "primary",
	size = "sm",
	onClick,
	children,
	...rest
}) => (
	<button
		{...rest}
		onClick={onClick}
		className={`btn btn-${size} btn-outline-${type}`}>
		{children}
	</button>
);
