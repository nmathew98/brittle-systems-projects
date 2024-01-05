import { Icon } from "../../Icon";

export const ButtonAction = ({
	type = "primary",
	onClick,
	icon,
	isActive,
	children,
	disabled,
}: ButtonActionProps) => (
	<button
		onClick={onClick}
		className={joinClasses(
			!!isActive,
			`btn btn-sm btn-outline-${type}`,
			"btn-outline-active",
		)}
		disabled={disabled}>
		<Icon name={icon} />
		&nbsp;{children}
	</button>
);

interface ButtonActionProps {
	type?: "primary" | "secondary" | "danger";
	onClick?: () => any;
	icon: string;
	isActive?: boolean;
	children?: any;
	disabled?: boolean;
}
