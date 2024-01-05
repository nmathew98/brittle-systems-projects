import type { ElementType } from "react";

export const TagOutline = ({ as = "li", ...rest }: TagOutlineProps<any>) => {
	const As = as as unknown as ElementType;

	return <As {...rest} className="tag-default tag-pill tag-outline" />;
};

interface TagOutlineProps<T extends ElementType> extends Record<string, any> {
	as?: T;
}
