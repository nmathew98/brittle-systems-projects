import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import DOMPurify from "dompurify";

import { useAuthorization } from "../auth/useAuthorization";
import { useArticle } from "../article/useArticle";

export const useUser = ({
	username,
	slug,
}: {
	username?: string | null;
	slug?: string | null;
}) => {
	const navigate = useNavigate();
	const [form, dispatchFormUpdate] = useReducer(reducer, initialForm);
	const [formErrors, setFormErrors] = useState<[string, string][] | null>(null);

	const queryClient = useQueryClient();
	const { isAuthenticated } = useContext(AuthContext);

	const {
		onChangeEmail,
		onChangePassword,
		onChangeUsername,
		formErrors: authorizationFieldErrors,
		makeOnSubmitForm: makeOnSubmitAuthorizationFields,
	} = useAuthorization();

	const { article, refetchArticle } = useArticle({ slug });

	const {
		createArticle: _createArticle,
		deleteArticle: _deleteArticle,
		updateArticle: _updateArticle,
		favoriteArticle: _favoriteArticle,
		unfavoriteArticle: _unfavoriteArticle,
		followUser: _followUser,
		unfollowUser: _unfollowUser,
		updateProfile: _updateCurrentUserProfile,
		refetchProfile: refetchCurrentUserProfile,
	} = useContext(UserContext);

	const {
		mutate: createArticle,
		isLoading: isLoadingCreateArticle,
		isError: isErrorCreateArticle,
		error: errorCreateArticle,
	} = useMutation<any, any, any>(_createArticle, {
		onSuccess: article => {
			navigate(`/article/${article.slug}`);
		},
	});

	const onArticleMutated = () => {
		if (article) refetchArticle();
	};

	const queryFnDeleteArticle = ({ slug }) =>
		_deleteArticle({ slug })({ body: null });
	const {
		mutate: deleteArticle,
		isLoading: isLoadingDeleteArticle,
		isError: isErrorDeleteArticle,
		error: errorDeleteArticle,
	} = useMutation<any, any, any>(queryFnDeleteArticle, {
		onSuccess: () => {
			queryClient.invalidateQueries([QUERY_KEYS.Article, slug]);
			queryClient.invalidateQueries([
				QUERY_KEYS.Articles,
				ARTICLES_TYPES.Global,
			]);

			navigate(`/profile/@${username}/?author=${username}#global`);
		},
	});

	const queryFnUpdateArticle = ({ body }) => _updateArticle({ slug })({ body });
	const {
		mutate: updateArticle,
		isLoading: isLoadingUpdateArticle,
		isError: isErrorUpdateArticle,
		error: errorUpdateArticle,
	} = useMutation<any, any, any>(queryFnUpdateArticle, {
		onSuccess: () => {
			queryClient.invalidateQueries([QUERY_KEYS.Article, slug]);
			queryClient.invalidateQueries([
				QUERY_KEYS.Articles,
				ARTICLES_TYPES.Global,
			]);

			navigate(`/profile/@${username}/?author=${username}#global`);
		},
	});

	const queryFnFavoriteArticle = ({ slug }) =>
		_favoriteArticle({ slug })({ body: null });
	const {
		mutate: favoriteArticle,
		isLoading: isLoadingFavoriteArticle,
		isError: isErrorFavoriteArticle,
		error: errorFavoriteArticle,
	} = useMutation<any, any, any>(queryFnFavoriteArticle, {
		onSuccess: onArticleMutated,
	});

	const queryFnUnfavoriteArticle = ({ slug }) =>
		_unfavoriteArticle({ slug })({ body: null });
	const {
		mutate: unfavoriteArticle,
		isLoading: isLoadingUnfavoriteArticle,
		isError: isErrorUnfavoriteArticle,
		error: errorUnfavoriteArticle,
	} = useMutation<any, any, any>(queryFnUnfavoriteArticle, {
		onSuccess: onArticleMutated,
	});

	const { mutate: followUser, isLoading: isLoadingFollowUser } = useMutation<
		any,
		any,
		any
	>(_followUser, { onSuccess: onArticleMutated });
	const { mutate: unfollowUser, isLoading: isLoadingUnfollowUser } =
		useMutation<any, any, any>(_unfollowUser, {
			onSuccess: () => {
				if (article) onArticleMutated();
				else refetchUserProfile();
			},
		});

	const {
		mutate: updateUser,
		error: errorUpdateUser,
		isLoading: isLoadingUpdateUser,
		isError: isErrorUpdateUser,
	} = useMutation<any, any, any>(_updateCurrentUserProfile, {
		onSuccess: () => {
			queryClient.invalidateQueries(QUERY_KEYS.CurrentUser);
			refetchCurrentUserProfile();
		},
	});

	const queryFnGetProfile = () =>
		Resources.User.read.username({ username })({ body: null });
	const { data: profile, refetch: refetchUserProfile } = useQuery(
		[QUERY_KEYS.Profile, username],
		queryFnGetProfile,
		{
			enabled: !!username,
			onError: () => navigate("/"),
		},
	);

	const validators = {
		// https://regexr.com/39nr7
		image: url =>
			!/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(
				url,
			),
		bio: /[^a-zA-Z0-9\s]/,
		description: /[^a-zA-Z0-9\s]/,
		title: /[^a-zA-Z0-9\s]/,
		body: /[^a-zA-Z0-9\s]/,
		tags: /[^a-zA-Z0-9,\s]/,
	};

	const errors = {
		image: "Avatar URL must be a valid HTTP link",
		bio: "Bio can only contain words and numbers",
		description: "Description can only contain words and numbers",
		title: "Title can only contain words and numbers",
		body: "Body can only contain words and numbers",
		tags: "Tags can only contain words and numbers",
	};

	const onChangeBio = event =>
		dispatchFormUpdate({
			type: PROFILE_UPDATE_TYPES.UpdateBio,
			bio: event.target.value,
		});

	const onChangeAvatar = event =>
		dispatchFormUpdate({
			type: PROFILE_UPDATE_TYPES.UpdateImage,
			image: event.target.value,
		});
	const onSubmitAuthorizationFields = makeOnSubmitAuthorizationFields(
		form => form,
		true,
	);
	const makeOnSubmitProfileForm = (f, isOptional?: boolean) => event => {
		event.preventDefault();

		const authorizationFields = onSubmitAuthorizationFields(event);
		const profileFields = form;

		const merged = {
			...authorizationFields,
			...profileFields,
		};

		if (!isOptional && Object.values(merged).length === 0) {
			setFormErrors([["form", "Form is incomplete"]]);

			return form;
		}

		dispatchFormUpdate({ type: PROFILE_UPDATE_TYPES.Reset });

		return f(merged, event);
	};

	const onChangeArticleTitle = event =>
		dispatchFormUpdate({
			type: UPSERT_ARTICLE_TYPES.UpsertTitle,
			title: event.target.value,
		});
	const onChangeArticleDescription = event =>
		dispatchFormUpdate({
			type: UPSERT_ARTICLE_TYPES.UpsertDescription,
			description: event.target.value,
		});
	const onChangeArticleBody = event =>
		dispatchFormUpdate({
			type: UPSERT_ARTICLE_TYPES.UpsertBody,
			body: event.target.value,
		});
	const onChangeArticleTags = event =>
		dispatchFormUpdate({
			type: UPSERT_ARTICLE_TYPES.UpsertTags,
			tags: event.target.value,
		});
	const transformArticleForm = form => ({
		title: DOMPurify.sanitize(form.title, { html: true }),
		description: DOMPurify.sanitize(form.description, { html: true }),
		body: DOMPurify.sanitize(form.body, { html: true }),
		tagList: DOMPurify.sanitize(form.tags, { html: true })
			.split(/,\s*/)
			.map(tag => tag.trim().toLowerCase()),
	});
	const makeOnSubmitArticleForm = (f, isOptional?: boolean) => event => {
		event.preventDefault();

		if (!isOptional && Object.values(form).length === 0) {
			setFormErrors([["form", "Form is incomplete"]]);

			return form;
		}

		dispatchFormUpdate({ type: UPSERT_ARTICLE_TYPES.Reset });

		return f(transformArticleForm(form), event);
	};

	const makeOnClickFavorite = () => () => {
		if (!isAuthenticated) return navigate("/login");

		if (!article.favorited) favoriteArticle({ slug });
		else unfavoriteArticle({ slug });
	};
	const makeOnClickDeleteArticle = () => () => {
		if (!isAuthenticated) return navigate("/login");

		deleteArticle({ slug });
	};
	const makeOnClickEditArticle = () => () => {
		if (!isAuthenticated) return navigate("/login");

		navigate(`/article/edit/${slug}`);
	};
	const makeOnClickFollow = () => () => {
		if (!isAuthenticated) return navigate("/login");

		if (article) {
			if (article.author.following)
				unfollowUser({ username: article.author.username });
			else followUser({ username: article.author.username });
		} else {
			if (profile.following) unfollowUser({ username: profile.username });
			else followUser({ username: profile.username });
		}
	};

	useEffect(() => {
		const formErrors = Object.entries(form)
			.filter(([key, value]) => {
				if (validators[key] instanceof RegExp)
					return value && validators[key].test(value);
				else return value && validators[key](value);
			})
			.map(([key]) => [key, errors[key]]) as [string, string][];

		setFormErrors(formErrors.concat(authorizationFieldErrors ?? []));
	}, [form, authorizationFieldErrors]);

	return {
		profile,
		formErrors,
		onChangeEmail,
		onChangeUsername,
		onChangePassword,
		onChangeBio,
		onChangeAvatar,
		makeOnSubmitProfileForm,
		onChangeArticleTitle,
		onChangeArticleDescription,
		onChangeArticleBody,
		onChangeArticleTags,
		makeOnSubmitArticleForm,
		makeOnClickFavorite,
		makeOnClickDeleteArticle,
		makeOnClickEditArticle,
		makeOnClickFollow,
		updateUser,
		createArticle,
		updateArticle,
		favoriteArticle,
		unfavoriteArticle,
		isLoadingCreateArticle,
		isLoadingDeleteArticle,
		isLoadingUpdateArticle,
		isLoadingFavoriteArticle:
			isLoadingFavoriteArticle || isLoadingUnfavoriteArticle,
		isLoadingFollowUser: isLoadingFollowUser || isLoadingUnfollowUser,
		isLoadingUpdateUser,
		isErrorCreateArticle:
			isErrorCreateArticle || (formErrors && formErrors.length > 0),
		isErrorDeleteArticle,
		isErrorUpdateArticle:
			isErrorUpdateArticle || (formErrors && formErrors.length > 0),
		isErrorFavoriteArticle,
		isErrorUnfavoriteArticle,
		isErrorUpdateUser:
			isErrorUpdateUser || (formErrors && formErrors.length > 0),
		errorCreateArticle,
		errorDeleteArticle,
		errorUpdateArticle,
		errorFavoriteArticle,
		errorUnfavoriteArticle,
		errorUpdateUser,
	};
};

const PROFILE_UPDATE_TYPES = {
	UpdateImage: Symbol("UpdateImage"),
	UpdateBio: Symbol("UpdateBio"),
	Reset: Symbol("Reset"),
};

const UPSERT_ARTICLE_TYPES = {
	UpsertTitle: Symbol("UpsertTitle"),
	UpsertDescription: Symbol("UpsertDescription"),
	UpsertBody: Symbol("UpsertBody"),
	UpsertTags: Symbol("UpsertTags"),
	Reset: Symbol("Reset"),
};

const reducer = (state, action) => {
	switch (action.type) {
		case PROFILE_UPDATE_TYPES.UpdateImage: {
			return { ...state, image: action.image };
		}
		case PROFILE_UPDATE_TYPES.UpdateBio: {
			return { ...state, bio: action.bio };
		}
		case PROFILE_UPDATE_TYPES.Reset: {
			return Object.create(null);
		}
		case UPSERT_ARTICLE_TYPES.UpsertTitle: {
			return { ...state, title: action.title.trim() };
		}
		case UPSERT_ARTICLE_TYPES.UpsertDescription: {
			return { ...state, description: action.description.trim() };
		}
		case UPSERT_ARTICLE_TYPES.UpsertBody: {
			return { ...state, body: action.body.trim() };
		}
		case UPSERT_ARTICLE_TYPES.UpsertTags: {
			return { ...state, tags: action.tags.trim() };
		}
		case UPSERT_ARTICLE_TYPES.Reset: {
			return Object.create(null);
		}
		default: {
			return state;
		}
	}
};

const initialForm = Object.create(null);
