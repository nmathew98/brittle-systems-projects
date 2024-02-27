export async function getArticles(
	this: Context,
	{ limit, offset }: Partial<GetArticlesArgs> = { limit: 20, offset: 0 },
	...records: InstanceType<typeof Collection>[]
) {
	const user = records.find(user => user instanceof User) as
		| InstanceType<typeof User>
		| undefined;

	const STATEMENT = `WITH article AS(
			SELECT 
				uuid,
				author,
				slug,
				title,
				description,
				body,
				created_at,
				updated_at 
			FROM ARTICLES
			LIMIT ${Number(limit) || 20}
			OFFSET ${Number(offset) || 0}
		), author AS(
			SELECT 
				uuid AS "author_uuid",
				username,
				bio,
				image
			FROM USERS
		), articles_count AS (
			SELECT
				COALESCE(
					(SELECT reltuples FROM PG_CLASS WHERE relname='ARTICLES'),
					(SELECT COUNT(uuid) FROM ARTICLES)
				)
			AS "count"
		)
		SELECT
			uuid,
			author,
			slug,
			title,
			description,
			body,
			created_at,
			updated_at,
			ARRAY(SELECT tag FROM ARTICLES_TAGS WHERE article=article.uuid) AS "tags",
			(SELECT
				is_active AS "is_favorited"
			FROM ARTICLES_FAVORITES
			WHERE ARTICLES_FAVORITES.article=article.uuid),			
			(SELECT 
				is_active AS "is_following" 
			FROM USERS_FOLLOWS 
			WHERE (origin=$1 AND destination=article.author)),
			(SELECT 
				COUNT(is_active) AS "favorites_count"
			FROM ARTICLES_FAVORITES
			WHERE (is_active=TRUE AND article=article.uuid)),
			username,
			bio,
			image,
			(SELECT
				count AS "articles_count"
			FROM articles_count)
		FROM article
		INNER JOIN author ON article.author=author.author_uuid`;

	const allResults = await this.pg.query(STATEMENT, [user?.uuid]);

	return allResults.rows.map(result => new Article(result));
}

interface GetArticlesArgs {
	limit?: number;
	offset?: number;
}
