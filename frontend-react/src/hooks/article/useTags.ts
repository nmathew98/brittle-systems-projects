import { useQuery } from "react-query";
import { minutesToMilliseconds } from "date-fns";

export const useTags = () => {
	const { getTags } = useContext(ArticleContext);

	const queryFnGetTags = () => getTags({ body: null });
	const { data, isLoading, isRefetching, isError, error } = useQuery(
		[QUERY_KEYS.Tags],
		queryFnGetTags,
		{
			refetchInterval: minutesToMilliseconds(5),
			refetchOnWindowFocus: false,
		},
	);

	return {
		tags: data,
		isLoadingTags: isLoading,
		isRefetchingTags: isRefetching,
		isErrorTags: isError,
		errorTags: error,
	};
};
