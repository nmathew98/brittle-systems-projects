import { Title } from "react-head";
import { useParams } from "react-router-dom";

import { LayoutArticleEdit } from "../../../layouts/Article/Edit";
import { FormInput } from "../../../components/Form/Input";
import { ButtonSubmit } from "../../../components/Button/Submit";
import { useUser } from "../../../hooks/user/useUser";
import { useArticle } from "../../../hooks/article/useArticle";
import { FormErrorContainer } from "../../../components/Form/Error/Container";
import { FormErrorItem } from "../../../components/Form/Error/Item";

export const ArticleEdit = () => (
	<LayoutArticleEdit>
		<Title>Editor - {BRAND_NAME}</Title>
		<Body />
	</LayoutArticleEdit>
);

const Body = () => {
	const params = useParams();

	const { profile } = useContext(UserContext);

	const {
		onChangeArticleTitle,
		onChangeArticleDescription,
		onChangeArticleBody,
		onChangeArticleTags,
		makeOnSubmitArticleForm,
		formErrors,
		updateArticle,
		isErrorUpdateArticle,
		errorUpdateArticle,
		isLoadingUpdateArticle,
	} = useUser({ username: profile?.username, slug: params?.slug });
	const { article } = useArticle({ slug: params?.slug });

	const onSubmit = makeOnSubmitArticleForm(form => {
		updateArticle({
			body: {
				article: form,
			},
		});
	});

	return (
		<>
			{!isErrorUpdateArticle ? null : (
				<FormErrorContainer>
					{formErrors &&
						formErrors.map(([key, value]) => (
							<FormErrorItem key={key}>{value}</FormErrorItem>
						))}
					{!(errorUpdateArticle instanceof AggregateError)
						? null
						: errorUpdateArticle?.errors?.map(([key, value]) => (
								<FormErrorItem key={key}>
									{key}&nbsp;{value}
								</FormErrorItem>
						  ))}
					{!(errorUpdateArticle instanceof HTTPError) ? null : (
						<FormErrorItem>
							Received status code: {errorUpdateArticle.status}&nbsp;-&nbsp;
							{errorUpdateArticle.statusText}
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
						placeholder={article?.title || "Article Title"}
						disabled={isLoadingUpdateArticle}
					/>
					<FormInput
						onChange={onChangeArticleDescription}
						type="text"
						placeholder={article?.description || "What's this article about?"}
						disabled={isLoadingUpdateArticle}
					/>
					<FormInput
						onChange={onChangeArticleBody}
						as="textarea"
						rows="8"
						type="text"
						placeholder={article?.body || "Write your article (in markdown)"}
						disabled={isLoadingUpdateArticle}
					/>
					<FormInput
						onChange={onChangeArticleTags}
						type="text"
						placeholder={article?.tagList.join(", ") || "Enter tags"}
						disabled={isLoadingUpdateArticle}
					/>
					<ButtonSubmit onClick={onSubmit} disabled={isLoadingUpdateArticle}>
						Publish Article
					</ButtonSubmit>
				</fieldset>
			</form>
		</>
	);
};
