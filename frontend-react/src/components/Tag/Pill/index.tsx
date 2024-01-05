import type { ElementType } from "react";

export const TagPill = ({ as = "li", ...rest }: TagPillProps<any>) => {
	const As = as;

	return <As {...rest} className="tag-pill tag-default" />;
};

interface TagPillProps<T extends ElementType> extends Record<string, any> {
	as?: T;
}
