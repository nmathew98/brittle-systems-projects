export async function deleteComment(
	this: Context,
	{ uuid }: DeleteCommentArgs,
	...records: InstanceType<typeof Collection>[]
) {
	const user = records.find(user => user instanceof User) as InstanceType<
		typeof User
	>;
	const article = records.find(
		article => article instanceof Article,
	) as InstanceType<typeof Article>;

	if (!user) throw new HTTPError(401, "Unauthorized");
	if (!article) throw new Error("Article not specified");

	const STATEMENT = `DELETE FROM ARTICLES_COMMENTS WHERE uuid=$1 AND author=$2 AND article=$3`;

	await this.pg.query(STATEMENT, [uuid, user.uuid, article.uuid]);
}

interface DeleteCommentArgs {
	uuid: string;
}
