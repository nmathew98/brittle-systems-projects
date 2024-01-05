export const ButtonSubmit = ({ size = "lg", onClick, children, ...rest }) => (
	<button
		{...rest}
		onClick={onClick}
		className={`btn btn-${size} btn-primary pull-xs-right`}>
		{children}
	</button>
);
