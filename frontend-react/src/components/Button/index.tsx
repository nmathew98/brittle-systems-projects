export const Button = ({
	type = "primary",
	size = "sm",
	onClick,
	children,
	...rest
}) => (
	<button {...rest} onClick={onClick} className={`btn btn-${size} btn-${type}`}>
		{children}
	</button>
);
