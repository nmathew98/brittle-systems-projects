import type { ElementType } from "react";

export const TagContainer = ({
	as = "ul",
	...rest
}: TagContainerProps<any>) => {
	const As = as as unknown as ElementType;

	return <As {...rest} className="tag-list" />;
};

interface TagContainerProps<T extends ElementType> extends Record<string, any> {
	as?: T;
}
