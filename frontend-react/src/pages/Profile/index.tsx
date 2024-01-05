import { Title } from "react-head";
import { Link, useSearchParams, useParams } from "react-router-dom";

import { Articles } from "../../components/Article";
import { LayoutProfile } from "../../layouts/Profile";
import { ArticleTabContainer } from "../../components/Article/Tab/Container";
import { ArticleTabItem } from "../../components/Article/Tab/Item";
import { createProfileArticleTab } from "../../hooks/auth/useNavigation";

export const Profile = () => (
	<LayoutProfile>
		<Body />
	</LayoutProfile>
);

const Body = () => {
	const params = useParams();
	const username = params?.username?.replace("@", "");

	return (
		<>
			<Title>{username} - Conduit</Title>
			<ArticleNavigation username={username} />
			<Articles />
		</>
	);
};

const ArticleNavigation = ({ username }) => {
	const [searchParams] = useSearchParams();

	const authenticatedArticleTabs = createProfileArticleTab(
		username,
		searchParams,
	);

	if (!username) return null;

	return (
		<ArticleTabContainer>
			{authenticatedArticleTabs?.map((item, index) => (
				<ArticleTabItem
					key={index}
					as={Link}
					to={item.href}
					isActive={item.isActive}>
					{item.title}
				</ArticleTabItem>
			))}
		</ArticleTabContainer>
	);
};
