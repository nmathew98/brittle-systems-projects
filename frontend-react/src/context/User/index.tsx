import React from "react";
import { useQuery } from "react-query";

export interface User {
	username: string;
	bio: string;
	image: string;
	following: boolean;
}

export const UserContext = React.createContext(Object.create(null));

export const UserProvider = ({ children }) => {
	const { onAuthenticationError, isAuthenticated } = useContext(AuthContext);

	const getProfile = async () => {
		// TODO:
		// There is a bug here if updating the username the refetch fails,
		// The error is cannot read email undefined, swagger does not say anything about it
		// The other fields seem to be fine
		const currentUser = await Resources.User.read.current({ body: null });

		return {
			email: currentUser.email,
			username: currentUser.username,
			bio: currentUser.bio,
			image: currentUser.image,
		};
	};

	const { data: profile, refetch: refetchProfile } = useQuery(
		QUERY_KEYS.CurrentUser,
		getProfile,
		{
			refetchOnWindowFocus: false,
			onError: onAuthenticationError,
			enabled: isAuthenticated,
		},
	);

	const updateProfile = Resources.User.update.profile;

	const followUser = useCallback(
		({ username }) =>
			Resources.User.update.follow({ username })({ body: null }),
		[],
	);

	const unfollowUser = useCallback(
		({ username }) =>
			Resources.User.update.unfollow({ username })({ body: null }),
		[],
	);

	const getArticle = Resources.Articles.read.single;

	const createArticle = Resources.Articles.create;
	const updateArticle = Resources.Articles.update.article;
	const favoriteArticle = Resources.Articles.update.favorite;
	const deleteArticle = Resources.Articles.delete.article;
	const unfavoriteArticle = Resources.Articles.delete.favorite;

	return (
		<UserContext.Provider
			value={{
				profile,
				refetchProfile,
				updateProfile,
				followUser,
				unfollowUser,
				createArticle,
				getArticle,
				updateArticle,
				favoriteArticle,
				deleteArticle,
				unfavoriteArticle,
			}}>
			{children}
		</UserContext.Provider>
	);
};
