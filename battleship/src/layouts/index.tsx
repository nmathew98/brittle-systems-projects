export const Layout = ({ children }: LayoutProps) => (
	<>
		<div className="mx-auto flex max-w-7xl justify-center bg-amber-500 px-4 sm:px-6">
			<div className="mt-4 grid w-full grid-cols-1 sm:mt-6">
				<div className="w-full">{children?.[2]}</div>

				<div className="max-w-3xl">{children?.[0]}</div>
			</div>
		</div>
		<div className="mx-auto flex max-w-7xl justify-center bg-white px-4 sm:px-6">
			<div className="my-4 grid w-full grid-cols-1 sm:my-6">
				<div className="max-w-3xl">{children?.[1]}</div>
			</div>
		</div>
	</>
);

interface LayoutProps {
	children?: any;
}
