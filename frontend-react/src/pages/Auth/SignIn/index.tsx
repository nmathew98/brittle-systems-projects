import { Title } from "react-head";

import { LayoutAuth } from "../../../layouts/Auth";
import { FormHeader } from "../../../components/Form/Header";
import { FormInput } from "../../../components/Form/Input";
import { FormErrorContainer } from "../../../components/Form/Error/Container";
import { FormErrorItem } from "../../../components/Form/Error/Item";
import { ButtonSubmit } from "../../../components/Button/Submit";
import { useAuthorization } from "../../../hooks/auth/useAuthorization";

export const SignIn = () => (
	<LayoutAuth>
		<Title>Sign in - {BRAND_NAME}</Title>
		<Body />
	</LayoutAuth>
);

const Body = () => {
	const {
		authenticate,
		isErrorLogin,
		errorLogin,
		formErrors,
		onChangeEmail,
		onChangePassword,
		makeOnSubmitForm,
	} = useAuthorization();

	const onSubmitForm = makeOnSubmitForm(form => {
		authenticate({
			body: {
				user: {
					email: form.email,
					password: form.password,
				},
			},
		});
	});

	return (
		<>
			<FormHeader
				title="Sign in"
				subtitle="Need an account?"
				subtitleHref="/register"
			/>
			{!isErrorLogin ? null : (
				<FormErrorContainer>
					{formErrors?.map(([key, value]) => (
						<FormErrorItem key={key}>{value}</FormErrorItem>
					))}
					{!(errorLogin instanceof AggregateError)
						? null
						: errorLogin?.errors?.map(([key, value]) => (
								<FormErrorItem key={key}>
									{key}&nbsp;{value}
								</FormErrorItem>
						  ))}
					{!(errorLogin instanceof HTTPError) ? null : (
						<FormErrorItem>
							Received status code: {errorLogin.status}&nbsp;-&nbsp;
							{errorLogin.statusText}
						</FormErrorItem>
					)}
				</FormErrorContainer>
			)}
			<form>
				<FormInput
					onChange={onChangeEmail}
					size="lg"
					type="email"
					placeholder="Email"
					autoComplete="email"
				/>
				<FormInput
					onChange={onChangePassword}
					size="lg"
					type="password"
					placeholder="Password"
					autoComplete="current-password"
				/>
				<ButtonSubmit onClick={onSubmitForm}>Sign in</ButtonSubmit>
			</form>
		</>
	);
};
