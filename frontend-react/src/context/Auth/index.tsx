import React from "react";

export const AuthContext = React.createContext(Object.create(null));

export const AuthProvider = ({ children }) => {
	const [hasAuthenticationSettled, setHasAuthenticationSettled] =
		useState(false);
	const [status, setStatus] = useState(AUTHENTICATION_STATUS.Unauthenticated);
	const [token, setToken] = useState<string | null>(null);

	const onAuthenticationSuccess = useCallback(
		result => {
			if (!import.meta.env.API && result?.token) {
				window.localStorage.setItem(STORAGE_KEYS.Token, result.token);

				setToken(result.token);
			} else {
				setToken(null);
			}

			setStatus(AUTHENTICATION_STATUS.Authenticated);
		},
		[setHasAuthenticationSettled, setToken, setStatus],
	);
	const onAuthenticationError = useCallback(() => {
		setToken(null);
		setStatus(AUTHENTICATION_STATUS.Unauthenticated);

		window.localStorage.removeItem(STORAGE_KEYS.Token);
	}, [setHasAuthenticationSettled, setToken, setStatus]);
	const onAuthenticationSettled = () => {
		setHasAuthenticationSettled(true);
	};

	const register = Resources.User.create;
	const authenticate = Resources.User.read.login;

	const verify = () => {
		if (!import.meta.env.API) {
			const token = window.localStorage.getItem(STORAGE_KEYS.Token);

			if (token) onAuthenticationSuccess({ token });
			else onAuthenticationError();

			onAuthenticationSettled();
		} else
			Resources.Auth.read
				.verify({ body: null })
				.then(onAuthenticationSuccess)
				.catch(onAuthenticationError)
				.finally(onAuthenticationSettled);
	};

	useEffect(verify, []);

	return (
		<AuthContext.Provider
			value={useMemo(
				() => ({
					register,
					authenticate,
					revoke: onAuthenticationError,
					verify,
					onAuthenticationSuccess,
					onAuthenticationError,
					isAuthenticated:
						!!token || status === AUTHENTICATION_STATUS.Authenticated,
					hasAuthenticationSettled,
				}),
				[
					register,
					authenticate,
					verify,
					onAuthenticationSuccess,
					onAuthenticationError,
					token,
					status,
					hasAuthenticationSettled,
				],
			)}>
			{children}
		</AuthContext.Provider>
	);
};
