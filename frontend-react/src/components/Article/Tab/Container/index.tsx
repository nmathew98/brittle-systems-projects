import React from "react";

export const ArticleTabContainer = ({ type = "feed", children }) => {
	const [activeTabIdx, setActiveTabIdx] = useState<number | null>(null);

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

		if (activeChild) setActiveTabIdx(activeChild as number);
	}, []);

	return (
		<div className={`${type}-toggle`}>
			<ul className="nav nav-pills outline-active">
				{React.Children.map(children, (child, index) => {
					if (!child || typeof child.type === "string") return child;

					const onClick = () => {
						setActiveTabIdx(index);
						child.props.onClick?.(index);
					};

					return React.cloneElement(child, {
						...child.props,
						isActive: child.props?.isActive ?? activeTabIdx === index,
						onClick,
					});
				})}
			</ul>
		</div>
	);
};
