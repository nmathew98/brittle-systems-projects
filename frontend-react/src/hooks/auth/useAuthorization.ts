import { useMutation } from "react-query";

export const useAuthorization = () => {
	const [form, dispatchFormUpdate] = useReducer(reducer, initialForm);
	const [formErrors, setFormErrors] = useState<[string, string][] | null>(null);
	const {
		register: _register,
		authenticate: _authenticate,
		onAuthenticationSuccess,
		onAuthenticationError,
		onAuthenticationSettled,
	} = useContext(AuthContext);

	const onChangeUsername = event =>
		dispatchFormUpdate({
			type: AUTHORIZATION_REDUCER_TYPES.UpdateUsername,
			username: event.target.value,
		});
	const onChangePassword = event =>
		dispatchFormUpdate({
			type: AUTHORIZATION_REDUCER_TYPES.UpdatePassword,
			password: event.target.value,
		});
	const onChangeEmail = event =>
		dispatchFormUpdate({
			type: AUTHORIZATION_REDUCER_TYPES.UpdateEmail,
			email: event.target.value,
		});
	const makeOnSubmitForm = (f, isOptional?: boolean) => event => {
		event.preventDefault();

		if (!isOptional && Object.values(form).length === 0) {
			setFormErrors([["form", "Form is incomplete"]]);

			return form;
		}

		return f(form, event);
	};

	const validators = {
		username: /[a-zA-Z0-9]{5,10}/,
		email: EMAIL_REGEX,
		password: /[a-zA-Z0-9]{8,12}/,
	};

	const errors = {
		username:
			"Username must be between 5 - 10 characters and only contain letters and numbers",
		email: "Invalid email address",
		password:
			"Password must be between 8 - 12 characters and only contain letters and numbers",
	};

	const {
		mutate: register,
		isLoading: isLoadingRegister,
		isError: isErrorRegister,
		error: errorRegister,
	} = useMutation<any, any, any>(_register, {
		onSuccess: onAuthenticationSuccess,
		onError: onAuthenticationError,
		onSettled: onAuthenticationSettled,
	});

	const {
		mutate: authenticate,
		isLoading: isLoadingLogin,
		isError: isErrorLogin,
		error: errorLogin,
	} = useMutation<any, any, any>(_authenticate, {
		onSuccess: onAuthenticationSuccess,
		onError: onAuthenticationError,
		onSettled: onAuthenticationSettled,
	});

	useEffect(() => {
		const formErrors = Object.entries(form)
			.filter(([key, value]) => value && !validators[key].test(value))
			.map(([key]) => [key, errors[key]]) as [string, string][];

		setFormErrors(formErrors);
	}, [form]);

	return {
		register,
		authenticate,
		isLoadingRegister,
		isLoadingLogin,
		isErrorRegister: isErrorRegister || (formErrors && formErrors?.length > 0),
		isErrorLogin: isErrorLogin || (formErrors && formErrors?.length > 0),
		errorRegister,
		errorLogin,
		formErrors,
		onChangeEmail,
		onChangePassword,
		onChangeUsername,
		makeOnSubmitForm,
	};
};

const AUTHORIZATION_REDUCER_TYPES = {
	UpdateUsername: Symbol("UpdateUsername"),
	UpdateEmail: Symbol("UpdateEmail"),
	UpdatePassword: Symbol("UpdatePassword"),
};

const reducer = (state, action) => {
	switch (action.type) {
		case AUTHORIZATION_REDUCER_TYPES.UpdateUsername: {
			return { ...state, username: action.username.toLowerCase() };
		}
		case AUTHORIZATION_REDUCER_TYPES.UpdateEmail: {
			return { ...state, email: action.email.toLowerCase() };
		}
		case AUTHORIZATION_REDUCER_TYPES.UpdatePassword: {
			return { ...state, password: action.password };
		}
		default: {
			return state;
		}
	}
};

const initialForm = Object.create(null);
