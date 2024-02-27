export const LayoutLg = ({ children }: LayoutLgProps) => (
	<div className="mx-auto max-w-7xl px-4 lg:px-8">
		<div className="my-4 grid grid-cols-1 lg:my-8 lg:grid-cols-2">
			<div className="w-full px-3">{children?.[0]}</div>

			<div className="w-full">{children?.[1]}</div>
		</div>
	</div>
);

interface LayoutLgProps {
	children?: any;
}
