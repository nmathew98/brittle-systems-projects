export async function deleteArticle(
	this: Context,
	{ slug }: DeleteArticleArgs,
	...records: InstanceType<typeof Collection>[]
) {
	const user = records.find(user => user instanceof User) as InstanceType<
		typeof User
	>;

	if (!user) throw new HTTPError(401, "Unauthorized");

	const STATEMENT = `DELETE FROM ARTICLES WHERE slug=$1`;

	await this.pg.query(STATEMENT, [slug]);
}

interface DeleteArticleArgs {
	slug: string;
}
