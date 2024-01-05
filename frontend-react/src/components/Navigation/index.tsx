import { useNavigation } from "../../hooks/auth/useNavigation";
import { NavigationContainer } from "./Container";
import { NavigationItem } from "./Item";

export const Navigation = () => {
	const { homeHref, allowedRoutes, isRouteActive } = useNavigation();

	return (
		<NavigationContainer brandName={BRAND_NAME} homeHref={homeHref}>
			{allowedRoutes?.map(item => (
				// @ts-expect-error: type stuff
				<NavigationItem
					key={item.title}
					{...item}
					isActive={isRouteActive(item)}>
					{item.title}
				</NavigationItem>
			))}
		</NavigationContainer>
	);
};
