export const ButtonCancel = ({ onClick, children, ...rest }) => (
	<button {...rest} onClick={onClick} className="btn btn-outline-danger">
		{children}
	</button>
);
