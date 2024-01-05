import React from "react";

export const ArticlePaginationContainer = ({ children }) => {
	const [activePage, setActivePage] = useState<number | null>(null);

	useEffect(() => {
		const activeChild = React.Children.toArray(children)
			.filter(child => typeof child !== "object")
			.map((child, index) => [
				!!(child as Record<string, any>).props?.isActive,
				index,
			])
			.filter(([isActive]) => Boolean(isActive))
			.flat()
			.pop();

		if (activeChild) setActivePage(activeChild as number);
	}, []);

	return (
		<ul className="pagination">
			{React.Children.map(children, (child, index) => {
				if (!child || typeof child.type === "string") return child;

				const onClick = () => {
					setActivePage(index);
					child.props.onClick?.(index);
				};

				return React.cloneElement(child, {
					...child.props,
					isActive: child.props?.isActive ?? activePage === index,
					onClick,
				});
			})}
		</ul>
	);
};
