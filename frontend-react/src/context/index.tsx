import { AuthProvider } from "./Auth";
import { UserProvider } from "./User";
import { ArticleProvider } from "./Article";
import { CommentProvider } from "./Comment";

export const Context = ({ children }) => (
	<AuthProvider>
		<UserProvider>
			<ArticleProvider>
				<CommentProvider>{children}</CommentProvider>
			</ArticleProvider>
		</UserProvider>
	</AuthProvider>
);
