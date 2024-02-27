export async function getComments(
	this: Context,
	_: any,
	...records: InstanceType<typeof Collection>[]
) {
	const user = records.find(user => user instanceof User) as InstanceType<
		typeof User
	>;
	const article = records.find(
		article => article instanceof Article,
	) as InstanceType<typeof Article>;

	if (!article) throw new Error("Article not specified");

	const STATEMENT = `WITH comment AS(
		SELECT
			uuid,
			author,
			article,
			body,
			created_at,
			updated_at
		FROM ARTICLES_COMMENTS
		WHERE article=$1
	), author AS(
		SELECT 
			uuid AS "author_uuid",
			username,
			bio,
			image
		FROM USERS
	)
	SELECT
		uuid,
		author,
		body,
		created_at,
		updated_at,
		username,
		bio,
		image,
		(SELECT 
			is_active AS "is_following" 
		FROM USERS_FOLLOWS 
		WHERE (origin=$2 AND destination=comment.author))
	FROM comment
	INNER JOIN author ON comment.author=author.author_uuid`;

	const allResults = await this.pg.query(STATEMENT, [article.uuid, user?.uuid]);

	return allResults.rows.map(row => new Comment(row));
}
