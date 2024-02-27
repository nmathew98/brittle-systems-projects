import { v6 } from "uuid-v6";

export async function makeArticle(
	this: Context,
	{
		slug,
		title,
		description,
		body,
		tagList,
	}: Partial<MakeArticleArgs> = Object.create(null),
	...records: InstanceType<typeof Collection>[]
) {
	const user = records.find(user => user instanceof User) as InstanceType<
		typeof User
	>;
	const article = records.find(
		article => article instanceof Article,
	) as InstanceType<typeof Article>;

	const isExistingArticle = !!slug || !!article;
	const isNewArticle = !slug && !!title && !!description && !!body && !!tagList;

	if (!user && isNewArticle) throw new HTTPError(401, "Unauthorized");

	if (isExistingArticle) {
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
			WHERE ${article ? "uuid=$1" : "slug=$1"}
		), author AS(
			SELECT 
				uuid AS "author_uuid",
				username,
				bio,
				image
			FROM USERS
			WHERE uuid=(SELECT author FROM article)
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
			WHERE (origin=$2 AND destination=article.author)),
			(SELECT 
				COUNT(is_active) AS "favorites_count"
			FROM ARTICLES_FAVORITES
			WHERE (is_active=TRUE AND article=article.uuid)),
			username,
			bio,
			image
		FROM article
		INNER JOIN author ON article.author=author.author_uuid`;

		if (!user) throw new Error("User not specified");

		const allResults = await this.pg.query(STATEMENT, [
			article?.uuid ?? slug,
			user.uuid,
		]);

		if (allResults.rows.length === 0)
			throw new HTTPError(404, "Invalid article");

		if (allResults.rows.length !== 1)
			throw new HTTPError(500, "Unexpected error occurred");

		const result = allResults.rows[0];

		return new Article(result);
	} else if (isNewArticle) {
		const slug = toSlug(title);

		const article = new Map([
			["uuid", v6()],
			["slug", slug],
			["title", title],
			["description", description],
			["body", body],
			["created_at", Date.now()],
			["updated_at", Date.now()],
			["author", user.uuid],
		]);
		const counter = new Counter(article.size);

		const [TAG_VALUES, tags] = tagList.reduce(
			([VALUES, tags], tag, index, array) => [
				VALUES +
					`($${counter.next}, $${counter.next}, (SELECT uuid::UUID FROM article))` +
					delimit(index, array),
				[...tags, v6(), tag.toLowerCase()],
			],
			["", [] as string[]],
		);
		const ARTICLES_STATEMENT = `INSERT INTO ARTICLES(
				uuid, 
				slug,
				title,
				description,
				body,
				created_at,
				updated_at,
				author
			) VALUES($1, $2, $3, $4, $5, $6, $7, $8)
			RETURNING uuid, slug, title, description, body, created_at, updated_at, author`;
		const TAGS_STATEMENT = `INSERT INTO ARTICLES_TAGS(
				uuid,
				tag,
				article
			) VALUES ${TAG_VALUES}
			RETURNING uuid, tag, article`;

		const STATEMENT_WITH_TAGS = `WITH article AS (${ARTICLES_STATEMENT}), tags AS (${TAGS_STATEMENT})
			SELECT
				uuid,
				slug,
				title,
				description,
				body,
				created_at,
				updated_at,
				author,
				ARRAY(SELECT tag FROM tags WHERE article=article.uuid) AS "tags",
				username,
				bio,
				image
			FROM article
			INNER JOIN
				(SELECT 
					uuid AS "author_uuid",
					username,
					bio,
					image 
				FROM USERS 
				WHERE uuid=(SELECT author FROM article)
				) AS PROFILE
			ON article.author=PROFILE.author_uuid`;

		const STATEMENT_WITHOUT_TAGS = `WITH article AS (${ARTICLES_STATEMENT})
			SELECT
				uuid,
				slug,
				title,
				description,
				body,
				created_at,
				updated_at,
				author,
				ARRAY[]::VARCHAR(20)[] AS "tags",
				username,
				bio,
				image
			FROM article
			INNER JOIN
				(SELECT 
					uuid AS "author_uuid",
					username,
					bio,
					image 
				FROM USERS 
				WHERE uuid=(SELECT author FROM article)
				) AS PROFILE
			ON article.author=PROFILE.author_uuid`;

		const STATEMENT =
			tagList.length > 0 ? STATEMENT_WITH_TAGS : STATEMENT_WITHOUT_TAGS;

		const allResults = await this.pg.query(
			STATEMENT,
			[...article.values()].concat(tagList.length > 0 ? tags : []),
		);

		if (allResults.rows.length !== 1)
			throw new HTTPError(500, "Unexpected error occurred");

		const result = allResults.rows[0];

		return new Article(result);
	}

	throw new Error("Invalid arguments");
}

const toSlug = (title: string) => title.toLowerCase().replace(/\s+/g, "-");

interface MakeArticleArgs {
	title: string;
	slug: string;
	description: string;
	body: string;
	tagList: string[];
}
