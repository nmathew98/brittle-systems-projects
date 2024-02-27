export async function getArticle(
	this: Context,
	{ slug }: GetArticleArgs,
	...records: InstanceType<typeof Collection>[]
) {
	const STATEMENT = `SELECT uuid FROM ARTICLES WHERE slug=$1`;

	const allResults = await this.pg.query(STATEMENT, [slug]);

	if (allResults.rows.length > 1)
		throw new HTTPError(500, "Unexpected error occurred");

	return [
		...records,
		new Article({
			...allResults.rows[0],
			slug,
		}),
	];
}

interface GetArticleArgs {
	slug: string;
}
