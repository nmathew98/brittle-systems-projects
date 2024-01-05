import { Title } from "react-head";

import { LayoutArticleCreate } from "../../../layouts/Article/Create";
import { FormInput } from "../../../components/Form/Input";
import { ButtonSubmit } from "../../../components/Button/Submit";
import { useUser } from "../../../hooks/user/useUser";
import { FormErrorContainer } from "../../../components/Form/Error/Container";
import { FormErrorItem } from "../../../components/Form/Error/Item";

export const ArticleCreate = () => (
	<LayoutArticleCreate>
		<Title>Editor - {BRAND_NAME}</Title>
		<Body />
	</LayoutArticleCreate>
);

const Body = () => {
	const {
		onChangeArticleTitle,
		onChangeArticleDescription,
		onChangeArticleBody,
		onChangeArticleTags,
		makeOnSubmitArticleForm,
		formErrors,
		createArticle,
		isErrorCreateArticle,
		errorCreateArticle,
		isLoadingCreateArticle,
	} = useUser({ username: null, slug: null });

	const onSubmit = makeOnSubmitArticleForm(form => {
		createArticle({
			body: {
				article: form,
			},
		});
	});

	return (
		<>
			{!isErrorCreateArticle ? null : (
				<FormErrorContainer>
					{formErrors &&
						formErrors.map(([key, value]) => (
							<FormErrorItem key={key}>{value}</FormErrorItem>
						))}
					{!(errorCreateArticle instanceof AggregateError)
						? null
						: errorCreateArticle?.errors?.map(([key, value]) => (
								<FormErrorItem key={key}>
									{key}&nbsp;{value}
								</FormErrorItem>
						  ))}
					{!(errorCreateArticle instanceof HTTPError) ? null : (
						<FormErrorItem>
							Received status code: {errorCreateArticle.status}&nbsp;-&nbsp;
							{errorCreateArticle.statusText}
						</FormErrorItem>
					)}
				</FormErrorContainer>
			)}
			<form>
				<fieldset>
					<FormInput
						onChange={onChangeArticleTitle}
						size="lg"
						type="text"
						placeholder="Article Title"
						disabled={isLoadingCreateArticle}
					/>
					<FormInput
						onChange={onChangeArticleDescription}
						type="text"
						placeholder="What's this article about?"
						disabled={isLoadingCreateArticle}
					/>
					<FormInput
						onChange={onChangeArticleBody}
						as="textarea"
						rows="8"
						type="text"
						placeholder="Write your article (in markdown)"
						disabled={isLoadingCreateArticle}
					/>
					<FormInput
						onChange={onChangeArticleTags}
						type="text"
						placeholder="Enter tags"
						disabled={isLoadingCreateArticle}
					/>
					<ButtonSubmit onClick={onSubmit} disabled={isLoadingCreateArticle}>
						Publish Article
					</ButtonSubmit>
				</fieldset>
			</form>
		</>
	);
};
