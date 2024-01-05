import { Link } from "react-router-dom";

export const FormHeader = ({
	title,
	subtitle,
	subtitleHref,
}: FormHeaderProps) => (
	<>
		<h1 className="text-xs-center">{title}</h1>
		{!subtitle ? null : (
			<p className="text-xs-center">
				{!subtitleHref ? subtitle : <Link to={subtitleHref}>{subtitle}</Link>}
			</p>
		)}
	</>
);

interface FormHeaderProps {
	title: string;
	subtitle?: string;
	subtitleHref?: string;
}
