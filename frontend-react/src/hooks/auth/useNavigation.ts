export const useNavigation = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const { profile } = useContext(UserContext);
	const [allowedRoutes, setAllowedRoutes] = useState<
		Record<string, any>[] | null
	>(null);
	const [articleTabs, setArticleTabs] = useState<Record<string, any>[] | null>(
		null,
	);

	const isRouteActive = item => window.location.pathname === item.href;

	useEffect(() => {
		if (!profile || !isAuthenticated) {
			setAllowedRoutes(unauthenticatedRoutes);
			setArticleTabs(unauthenticatedArticleTabs);
		} else {
			setAllowedRoutes(
				authenticatedRoutes.concat(
					createAvatarRoute(profile.username, profile?.image),
				),
			);
			setArticleTabs(authenticatedArticleTabs);
		}
	}, [profile]);

	const followerHash = ARTICLES_TYPES_HASH[ARTICLES_TYPES.Follower];
	const globalHash = ARTICLES_TYPES_HASH[ARTICLES_TYPES.Global];

	return {
		homeHref: `/?offset=0${profile ? followerHash : globalHash}`,
		articleTabs,
		allowedRoutes,
		isRouteActive,
	};
};

export const createProfileArticleTab = (
	username: string,
	searchParams: URLSearchParams,
) => {
	const myArticlesParams = new URLSearchParams({
		author: username,
	});
	const favoritedArticlesParams = new URLSearchParams({
		favorited: username,
	});

	return [
		{
			title: "My Articles",
			href: `/profile/@${username}/?${myArticlesParams.toString()}${
				ARTICLES_TYPES_HASH[ARTICLES_TYPES.Global]
			}`,
			hash: ARTICLES_TYPES_HASH[ARTICLES_TYPES.Global],
			isActive: !searchParams.has("favorited"),
		},
		{
			title: "Favorited Articles",
			href: `/profile/@${username}/?${favoritedArticlesParams.toString()}${
				ARTICLES_TYPES_HASH[ARTICLES_TYPES.Global]
			}`,
			hash: ARTICLES_TYPES_HASH[ARTICLES_TYPES.Global],
			isActive: searchParams.has("favorited"),
		},
	];
};

const authenticatedRoutes = [
	{
		title: "Home",
		href: `/?offset=0${ARTICLES_TYPES_HASH[ARTICLES_TYPES.Follower]}`,
	},
	{
		title: "New Article",
		href: "/article/create",
		icon: "ion-compose",
	},
	{
		title: "Settings",
		href: "/settings",
		icon: "ion-gear-a",
	},
];

const createAvatarRoute = (username: string, avatar: string) => {
	const myArticlesParams = new URLSearchParams({
		author: username,
	});

	return {
		title: username,
		href: `/profile/@${username}/?${myArticlesParams.toString()}${
			ARTICLES_TYPES_HASH[ARTICLES_TYPES.Global]
		}`,
		avatar: avatar ?? "https://api.realworld.io/images/smiley-cyrus.jpeg",
		username: username,
	};
};

const unauthenticatedRoutes = [
	{
		title: "Home",
		href: "/",
	},
	{
		title: "Sign in",
		href: "/login",
	},
	{
		title: "Sign up",
		href: "/register",
	},
];

const unauthenticatedArticleTabs = [
	{
		title: "Global Feed",
		href: `/?offset=0${ARTICLES_TYPES_HASH[ARTICLES_TYPES.Global]}`,
		hash: ARTICLES_TYPES_HASH[ARTICLES_TYPES.Global],
	},
];

const authenticatedArticleTabs: ArticleTab[] = [
	{
		title: "Your Feed",
		href: `/?offset=0${ARTICLES_TYPES_HASH[ARTICLES_TYPES.Follower]}`,
		hash: ARTICLES_TYPES_HASH[ARTICLES_TYPES.Follower],
	},
	{
		title: "Global Feed",
		href: `/?offset=0${ARTICLES_TYPES_HASH[ARTICLES_TYPES.Global]}`,
		hash: ARTICLES_TYPES_HASH[ARTICLES_TYPES.Global],
	},
];

interface ArticleTab {
	title: string;
	href: string;
	hash?: string;
}
