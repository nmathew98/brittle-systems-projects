import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { minutesToMilliseconds } from "date-fns";

export const useArticle = ({ slug }) => {
	const navigate = useNavigate();

	const [form, dispatchFormUpdate] = useReducer(reducer, initialForm);
	const [formErrors, setFormErrors] = useState<[string, string][] | null>(null);

	const { transformArticle } = useContext(ArticleContext);
	const { getArticle: _getArticle } = useContext(UserContext);
	const {
		getComments: _getComments,
		createComment: _createComment,
		deleteComment: _deleteComment,
		transformComment,
	} = useContext(CommentContext);

	const queryFnGetArticle = () => _getArticle({ slug })({ body: null });
	const {
		data: article,
		refetch: refetchArticle,
		isLoading: isLoadingGetArticle,
		isRefetching: isRefetchingGetArticle,
		isError: isErrorGetArticle,
		error: errorGetArticles,
	} = useQuery([QUERY_KEYS.Article, slug], queryFnGetArticle, {
		refetchOnWindowFocus: false,
		select: transformArticle,
		enabled: !!slug,
		onError: () => {
			navigate("/");
		},
	});

	const queryFnGetComments = () => _getComments({ slug })({ body: null });
	const {
		data: comments,
		refetch: refetchComments,
		isLoading: isLoadingGetComments,
		isRefetching: isRefetchingGetComments,
		isError: isErrorGetComments,
		error: errorGetComments,
	} = useQuery([QUERY_KEYS.Comments, slug], queryFnGetComments, {
		refetchInterval: minutesToMilliseconds(2.5),
		refetchIntervalInBackground: true,
		refetchOnWindowFocus: false,
		select: comments => comments.map(transformComment),
		enabled: !!article && !!slug,
	});

	const queryFnCreateComment = _createComment({ slug });
	const {
		mutate: createComment,
		isLoading: isLoadingCreateComment,
		isError: isErrorCreateComment,
		error: errorCreateComment,
	} = useMutation<any, any, any>(queryFnCreateComment, {
		// The types don't match but all we need is a reference
		onSuccess: refetchComments as any,
	});

	const queryFnDeleteComment = ({ id }) =>
		_deleteComment({ slug, id })({ body: null });
	const {
		mutate: deleteComment,
		isLoading: isLoadingDeleteComment,
		isError: isErrorDeleteComment,
		error: errorDeleteComment,
	} = useMutation<any, any, any>(queryFnDeleteComment, {
		// The types don't match but all we need is a reference
		onSuccess: refetchComments as any,
	});
	const makeOnClickDeleteComment =
		({ id }) =>
		() =>
			deleteComment({ id });

	const validators = {
		comment: /[\w\d]/,
	};

	const errors = {
		comment: "Comment can only contain words and numbers",
	};

	const onChangeComment = event =>
		dispatchFormUpdate({
			type: ARTICLE_REDUCER_TYPES.UpdateComment,
			comment: event.target.value,
		});

	const makeOnSubmitForm = (f, isOptional?: boolean) => event => {
		event.preventDefault();

		if (!isOptional && Object.values(form).length === 0) {
			setFormErrors([["form", "Form is incomplete"]]);

			return form;
		}

		return f(form, event);
	};

	useEffect(() => {
		const formErrors = Object.entries(form)
			.filter(([key, value]) => value && !validators[key].test(value))
			.map(([key]) => [key, errors[key]]) as [string, string][];

		setFormErrors(formErrors);
	}, [form]);

	return {
		article,
		comments,
		onChangeComment,
		makeOnSubmitForm,
		formErrors,
		refetchArticle,
		refetchComments,
		createComment,
		makeOnClickDeleteComment,
		isRefetchingGetArticle,
		isRefetchingGetComments,
		isLoadingGetArticle,
		isLoadingGetComments,
		isLoadingCreateComment,
		isLoadingDeleteComment,
		isErrorGetArticle,
		isErrorGetComments,
		isErrorCreateComment,
		isErrorDeleteComment,
		errorGetArticles,
		errorGetComments,
		errorCreateComment,
		errorDeleteComment,
	};
};

const ARTICLE_REDUCER_TYPES = {
	UpdateComment: Symbol("UpdateComment"),
};

const reducer = (state, action) => {
	switch (action.type) {
		case ARTICLE_REDUCER_TYPES.UpdateComment: {
			return { ...state, comment: action.comment };
		}
		default: {
			return state;
		}
	}
};

const initialForm = Object.create(null);
