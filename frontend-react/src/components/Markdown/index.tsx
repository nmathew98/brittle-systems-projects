import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const remarkPlugins = [remarkGfm];

export const Markdown = ({ children }) => (
	<ReactMarkdown remarkPlugins={remarkPlugins}>{children}</ReactMarkdown>
);
