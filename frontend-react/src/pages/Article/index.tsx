import { Fragment } from "react";
import { Title } from "react-head";
import { useParams, Link } from "react-router-dom";

import { LayoutArticle } from "../../layouts/Article";
import { useArticle } from "../../hooks/article/useArticle";
import { useUser } from "../../hooks/user/useUser";
import { ArticleHeader as _ArticleHeader } from "../../components/Article/Header";
import { ArticleContent } from "../../components/Article/Content";
import { ArticleActionBar } from "../../components/Article/ActionBar";
import { CommentForm as _CommentForm } from "../../components/Comment/Form";
import { CommentCard } from "../../components/Comment/Card";

export const Article = () => (
	<LayoutArticle>
		<Fragment key="ArticleHeader">
			<ArticleHeader />
		</Fragment>
		<Fragment key="ArticleActions">
			<ArticleActions />
		</Fragment>
		<Fragment key="CommentForm">
			<CommentForm />
		</Fragment>
		<Fragment key="CommentCards">
			<Comments />
		</Fragment>
		<Fragment key="ArticleContent">
			<Body />
		</Fragment>
	</LayoutArticle>
);

const ArticleHeader = () => {
	const params = useParams();

	const { profile } = useContext(UserContext);
	const { article } = useArticle({ slug: params?.slug });
	const {
		makeOnClickFollow,
		makeOnClickFavorite,
		makeOnClickDeleteArticle,
		makeOnClickEditArticle,
		isLoadingFavoriteArticle,
		isLoadingDeleteArticle,
		isLoadingFollowUser,
	} = useUser({ username: profile?.username, slug: params?.slug });

	const onClickFollowAuthor = makeOnClickFollow();
	const onClickFavorite = makeOnClickFavorite();
	const onClickDeleteArticle = makeOnClickDeleteArticle();
	const onClickEditArticle = makeOnClickEditArticle();

	if (!article) return null;

	return (
		<>
			<Title>
				{article.title} - {BRAND_NAME}
			</Title>
			<_ArticleHeader
				title={article.title}
				profileImage={article.author.image}
				profileLink={`/profile/@${article.author.username}/?author=${article.author.username}#global`}
				author={article.author.username}
				createdAt={article.createdAt}
				favoritesCount={article.favoritesCount}
				isAuthor={profile?.username === article.author.username}
				onClickFavorite={onClickFavorite}
				onClickFollowAuthor={onClickFollowAuthor}
				onClickDeleteArticle={onClickDeleteArticle}
				onClickEditArticle={onClickEditArticle}
				isFollowingAuthor={article.author.following}
				isLoadingFavoriteArticle={isLoadingFavoriteArticle}
				isLoadingDeleteArticle={isLoadingDeleteArticle}
				isLoadingFollowAuthor={isLoadingFollowUser}
			/>
		</>
	);
};

const ArticleActions = () => {
	const params = useParams();

	const { profile } = useContext(UserContext);
	const { article } = useArticle({ slug: params?.slug });
	const {
		makeOnClickFollow,
		makeOnClickFavorite,
		makeOnClickDeleteArticle,
		makeOnClickEditArticle,
		isLoadingFavoriteArticle,
		isLoadingDeleteArticle,
		isLoadingFollowUser,
	} = useUser({ username: profile?.username, slug: params?.slug });

	const onClickFollowAuthor = makeOnClickFollow();
	const onClickFavorite = makeOnClickFavorite();
	const onClickDeleteArticle = makeOnClickDeleteArticle();
	const onClickEditArticle = makeOnClickEditArticle();

	if (!article) return null;

	return (
		<ArticleActionBar
			profileImage={article.author.image}
			profileLink={`/profile/@${article.author.username}/?author=${article.author.username}#global`}
			author={article.author.username}
			createdAt={article.createdAt}
			favoritesCount={article.favoritesCount}
			isAuthor={profile?.username === article.author.username}
			onClickFavorite={onClickFavorite}
			onClickFollowAuthor={onClickFollowAuthor}
			onClickDeleteArticle={onClickDeleteArticle}
			onClickEditArticle={onClickEditArticle}
			isFollowingAuthor={article.author.following}
			isLoadingFavoriteArticle={isLoadingFavoriteArticle}
			isLoadingDeleteArticle={isLoadingDeleteArticle}
			isLoadingFollowAuthor={isLoadingFollowUser}
		/>
	);
};

const CommentForm = () => {
	const params = useParams();

	const { isAuthenticated } = useContext(AuthContext);
	const { profile } = useContext(UserContext);

	const {
		createComment,
		onChangeComment,
		makeOnSubmitForm,
		isLoadingCreateComment,
		isLoadingGetArticle,
	} = useArticle({
		slug: params?.slug,
	});

	const formId = useId();

	const onPostComment = makeOnSubmitForm(form => {
		createComment(
			{
				body: {
					comment: {
						body: form.comment,
					},
				},
			},
			{
				onSuccess: () => {
					const commentForm = document.getElementById(
						formId,
					) as HTMLFormElement;

					commentForm?.reset();
				},
			},
		);
	});

	if (!isAuthenticated || !profile || isLoadingGetArticle)
		return (
			<p>
				<Link to="/login">Sign in</Link> or <Link to="/register">sign up</Link>
				&nbsp; to add comments on this article.
			</p>
		);

	return (
		<_CommentForm
			id={formId}
			onChangeComment={onChangeComment}
			onPostComment={onPostComment}
			profileImage={profile.image}
			profileLink={`/profile/@${profile.username}/?author=${profile.username}#global`}
			isLoading={isLoadingCreateComment}
		/>
	);
};

const Comments = () => {
	const params = useParams();

	const { profile } = useContext(UserContext);
	const { comments, makeOnClickDeleteComment } = useArticle({
		slug: params?.slug,
	});

	return comments?.map(comment => {
		const onClickDelete = makeOnClickDeleteComment({
			id: comment.id,
		});

		return (
			<CommentCard
				key={comment.id}
				text={comment.body}
				profileImage={comment.author.image}
				profileLink={`/profile/@${comment.author.username}/?author=${comment.author.username}#global`}
				author={comment.author.username}
				createdAt={comment.createdAt}
				isAuthor={profile?.username === comment.author.username}
				onClickDelete={onClickDelete}
			/>
		);
	});
};

const Body = () => {
	const params = useParams();

	const { article } = useArticle({ slug: params?.slug });

	if (!article) return null;

	return <ArticleContent text={article.body} tags={article.tagList} />;
};
