import { Link } from "react-router-dom";

import { Icon } from "../../Icon";

export const NavigationItem = ({
	href,
	icon,
	avatar,
	username,
	isActive,
	children,
}) => (
	<li className="nav-item">
		<Link className={joinClasses(isActive, "nav-link", "active")} to={href}>
			{(icon || avatar) && (
				<>
					{icon && <Icon name={icon} />}
					{avatar && <img src={avatar} className="user-pic" alt={username} />}
					&nbsp;
				</>
			)}
			{children}
		</Link>
	</li>
);
