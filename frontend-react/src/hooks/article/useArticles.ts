import type { URLSearchParamsInit } from "react-router-dom";
import { useQueryClient, useInfiniteQuery } from "react-query";
import { minutesToMilliseconds } from "date-fns";
import { useLocation, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { usePreviousValueEffect } from "../usePreviousValueEffect";
import { useUser } from "../user/useUser";

export const useArticles = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const type =
		ARTICLES_TYPES_HASH[location.hash?.toLowerCase()] ?? ARTICLES_TYPES.Global;
	const filters: Record<string, any> = {
		limit: 10,
		...Object.fromEntries(searchParams),
	};
	const [isArticleBeingMutated, setIsArticleBeingMutated] = useState(false);

	const matchAccordingToType = makeMatch(type);

	const {
		getAllFollowerArticles: _getAllFollowerArticles,
		getAllGlobalArticles: _getAllGlobalArticles,
		transformArticle,
	} = useContext(ArticleContext);
	const { profile, isAuthenticated } = useContext(AuthContext);

	const { favoriteArticle, unfavoriteArticle } = useUser({
		username: profile?.username,
		slug: null,
	});

	const [currentPage, setCurrentPage] = useState(
		convertOffsetToPage(filters.offset, filters.limit),
	);

	const _getAllArticles = matchAccordingToType(
		_getAllFollowerArticles,
		_getAllGlobalArticles,
	);

	const queryFnGetAllArticles = async ({
		pageParam: _offset,
	}: {
		pageParam?: number;
	}) => {
		const offset = _offset ?? filters.offset;

		const result = await _getAllArticles({
			...filters,
			offset,
		})({ body: null });

		return {
			page: convertOffsetToPage(offset, filters.limit),
			...result,
		};
	};
	const getNextPageParam = (lastPage, allPages) => {
		const currentPage = lastPage.page;
		const totalNumberOfPages = calculateTotalNumberOfPages(
			lastPage,
			filters.limit,
		);

		if (currentPage === totalNumberOfPages) return undefined;

		return allPages.length * filters.limit;
	};
	const getPreviousPageParam = (_, allPages) => {
		if (allPages.length === 1) return undefined;

		return (allPages.length - 1) * filters.limit;
	};

	const cacheArticles = result =>
		result?.pages?.forEach(page => {
			page.articles.forEach(article => {
				const cached = queryClient.getQueryData([
					QUERY_KEYS.Articles,
					article.slug,
				]);

				if (!cached)
					queryClient.setQueryData([QUERY_KEYS.Article, article.slug], article);
			});
		});
	const transformArticles = result => ({
		...result,
		pages: result.pages.map(page => ({
			...page,
			articles: page.articles.map(transformArticle),
		})),
	});
	const {
		data,
		refetch: refetchArticles,
		isLoading: isLoadingArticles,
		isFetching: isFetchingArticles,
		isRefetching: isRefetchingArticles,
		isFetchingNextPage: isFetchingNextPageArticles,
		isFetchingPreviousPage: isFetchingPreviousPageArticles,
		fetchNextPage: fetchNextPageArticles,
		fetchPreviousPage: fetchPreviousPageArticles,
		isError: isErrorArticles,
		error: errorArticles,
	} = useInfiniteQuery([QUERY_KEYS.Articles, type], queryFnGetAllArticles, {
		refetchInterval: minutesToMilliseconds(2.5),
		refetchIntervalInBackground: true,
		refetchOnWindowFocus: false,
		getNextPageParam,
		getPreviousPageParam,
		select: transformArticles,
		onSettled: cacheArticles,
	});

	const onClickNextPage = async (page: number) => {
		const limit = Number(filters.limit);
		const offset = convertPageToOffset(Math.abs(page), limit);

		setSearchParams(prev => {
			const existing = Object.fromEntries(prev);

			return {
				...existing,
				offset: offset.toString(),
			} as URLSearchParamsInit;
		});

		await fetchNextPageArticles({ pageParam: offset });

		setCurrentPage(page);
	};

	const onClickPreviousPage = async (page: number) => {
		const limit = Number(filters.limit);
		const offset = convertPageToOffset(Math.abs(page), limit);

		setSearchParams(prev => {
			const existing = Object.fromEntries(prev);

			return {
				...existing,
				offset: offset.toString(),
			} as URLSearchParamsInit;
		});

		await fetchPreviousPageArticles({ pageParam: offset });

		setCurrentPage(page);
	};

	const makeOnClickPaginationItem = (page: number) => () => {
		if (page > currentPage) {
			onClickNextPage(page);
		} else {
			onClickPreviousPage(page);
		}
	};

	const makeOnClickFavorite = article => () => {
		if (!isAuthenticated) return navigate("/login");

		if (!article.favorited)
			favoriteArticle(
				{ slug: article.slug },
				{
					onSuccess: async () => {
						setIsArticleBeingMutated(true);
						await refetchArticles();
						setIsArticleBeingMutated(false);
					},
				},
			);
		else
			unfavoriteArticle(
				{ slug: article.slug },
				{
					onSuccess: async () => {
						setIsArticleBeingMutated(true);
						await refetchArticles();
						setIsArticleBeingMutated(false);
					},
				},
			);
	};

	usePreviousValueEffect((from, to) => {
		// When clicking the conduit logo
		// When we trigger a pagination item click directly,
		// `from.searchParams.offset === to.searchParams.offset === 0`
		// but there is no hash
		if (!to.hash) window.location.hash = from.hash;

		// This is handled by the effect on type
		if (location.hash !== to.hash) return undefined;

		const fromSearch = new URLSearchParams(from.search);
		const toSearch = new URLSearchParams(to.search);

		// `setSearchParams` modifies the hash to remove it
		if (fromSearch.get("offset") !== toSearch.get("offset")) {
			if (!to.hash) window.location.hash = from.hash;

			// If we have changed pages then there will already be a fetch in progress
			// If not we go from changing tags to global but with an offset of zero
			// so we will refetch
			if (isFetchingArticles) return undefined;

			// We run into this case when clicking on the conduit logo, it wont be fetching
			// but the offset is zero so we have to trigger a pagination item click
			if (!isFetchingArticles) {
				if (toSearch.has("offset")) {
					const toPage = convertOffsetToPage(
						toSearch.get("offset") as string,
						filters.limit,
					);

					makeOnClickPaginationItem(toPage)();
				}
			}
		}

		refetchArticles();
	}, location);

	return {
		currentPage,
		currentPageArticles: transformArticlesData(data?.pages, currentPage),
		makeOnClickPaginationItem,
		totalNumberOfPages: calculateTotalNumberOfPages(
			data?.pages?.at(0),
			filters.limit,
		),
		makeOnClickFavorite,
		totalNumberOfFetchedPages: data?.pages?.length ?? 0,
		refetchArticles,
		isLoadingArticles: isLoadingArticles,
		isRefetchingArticles: isRefetchingArticles && !isArticleBeingMutated,
		isChangingPageArticles:
			isFetchingNextPageArticles || isFetchingPreviousPageArticles,
		isErrorArticles,
		errorArticles,
	};
};

const convertOffsetToPage = (offset: number | string, limit: number | string) =>
	Math.max(Number(offset) / Number(limit) + 1, 0) || 1;

const convertPageToIndex = (page: number | string) =>
	Math.max(Number(page) - 1, 0);

const convertPageToOffset = (page: number | string, limit: number | string) =>
	Math.max(convertPageToIndex(Number(page)) * Number(limit), 0);

const calculateTotalNumberOfPages = (page, limit: number | string) =>
	Math.ceil(Number(page?.articlesCount ?? 0) / Number(limit));

const transformArticlesData = (pages, currentPage) =>
	pages?.find(item => item.page === currentPage)?.articles ?? [];

const makeMatch = buildMakeMatch(
	ARTICLES_TYPES.Follower,
	ARTICLES_TYPES.Global,
);
