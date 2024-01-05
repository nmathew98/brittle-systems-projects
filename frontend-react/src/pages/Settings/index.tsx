import { Title } from "react-head";

import { LayoutSettings } from "../../layouts/Settings";
import { FormInput } from "../../components/Form/Input";
import { ButtonSubmit } from "../../components/Button/Submit";
import { FormErrorContainer } from "../../components/Form/Error/Container";
import { FormErrorItem } from "../../components/Form/Error/Item";
import { useUser } from "../../hooks/user/useUser";

export const Settings = () => (
	<LayoutSettings>
		<Title> Settings - {BRAND_NAME}</Title>
		<Body />
	</LayoutSettings>
);

const Body = () => {
	const formRef = useRef<HTMLFormElement | null>(null);
	const { profile } = useContext(UserContext);

	const {
		formErrors,
		onChangeEmail,
		onChangePassword,
		onChangeUsername,
		onChangeBio,
		onChangeAvatar,
		makeOnSubmitProfileForm,
		updateUser,
		isErrorUpdateUser,
		isLoadingUpdateUser,
		errorUpdateUser,
	} = useUser({ username: null });

	const onSubmitForm = makeOnSubmitProfileForm(form => {
		updateUser(
			{
				body: {
					user: form,
				},
			},
			{
				onSuccess: () => {
					formRef.current?.reset();
				},
			},
		);
	});

	return (
		<>
			{!isErrorUpdateUser ? null : (
				<FormErrorContainer>
					{formErrors &&
						formErrors.map(([key, value]) => (
							<FormErrorItem key={key}>{value}</FormErrorItem>
						))}
					{!(errorUpdateUser instanceof AggregateError)
						? null
						: errorUpdateUser?.errors?.map(([key, value]) => (
								<FormErrorItem key={key}>
									{key}&nbsp;{value}
								</FormErrorItem>
						  ))}
					{!(errorUpdateUser instanceof HTTPError) ? null : (
						<FormErrorItem>
							Received status code: {errorUpdateUser.status}&nbsp;-&nbsp;
							{errorUpdateUser.statusText}
						</FormErrorItem>
					)}
				</FormErrorContainer>
			)}
			<form ref={formRef}>
				<fieldset>
					<FormInput
						type="text"
						placeholder={profile?.image || "URL of profile picture"}
						onChange={onChangeAvatar}
						disabled={isLoadingUpdateUser}
					/>
					<FormInput
						type="text"
						placeholder={profile?.username || "Username"}
						autoComplete="username"
						onChange={onChangeUsername}
						disabled={isLoadingUpdateUser}
					/>
					<FormInput
						as="textarea"
						rows="8"
						type="text"
						placeholder={profile?.bio || "Short bio about you"}
						onChange={onChangeBio}
						disabled={isLoadingUpdateUser}
					/>
					<FormInput
						type="email"
						placeholder={profile?.email || "Email"}
						autoComplete="email"
						onChange={onChangeEmail}
						disabled={isLoadingUpdateUser}
					/>
					<FormInput
						type="password"
						placeholder="New Password"
						autoComplete="new-password"
						onChange={onChangePassword}
						disabled={isLoadingUpdateUser}
					/>
					<ButtonSubmit onClick={onSubmitForm} disabled={isLoadingUpdateUser}>
						Update Settings
					</ButtonSubmit>
				</fieldset>
			</form>
		</>
	);
};
