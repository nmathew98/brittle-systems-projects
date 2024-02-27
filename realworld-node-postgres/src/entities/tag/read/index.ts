export async function findTags(this: Context) {
	const STATEMENT = `SELECT DISTINCT tag FROM ARTICLES_TAGS`;

	const allResults = await this.pg.query(STATEMENT);

	return allResults.rows.map(
		row =>
			new Tag({
				tag: row.tag,
			}),
	);
}
