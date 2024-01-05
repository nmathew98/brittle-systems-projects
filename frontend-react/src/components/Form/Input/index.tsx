import type { ElementType, ReactNode } from "react";

export const FormInput = ({
	as = "input",
	size = "md",
	children,
	...rest
}: FormInputProps<any>) => {
	const As = as as unknown as ElementType;

	return (
		<fieldset className="form-group">
			<As className={`form-control form-control-${size}`} {...rest} />
			{children}
		</fieldset>
	);
};

interface FormInputProps<T extends ElementType> extends Record<string, any> {
	as?: T;
	size?: string;
	children?: ReactNode;
}
