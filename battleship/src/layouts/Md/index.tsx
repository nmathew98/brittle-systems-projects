export const LayoutMd = ({ children }: LayoutMdProps) => (
	<>
		<div className="flex justify-center">
			<div className="mt-6">
				<div className="w-full">{children?.[2]}</div>

				<div className="my-6 flex space-x-4">
					<div className="w-4/12">{children?.[0]}</div>

					<div className="w-96">{children?.[1]}</div>
				</div>
			</div>
		</div>
	</>
);

interface LayoutMdProps {
	children?: any;
}
