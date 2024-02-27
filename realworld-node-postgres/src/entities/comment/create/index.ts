import { v6 } from "uuid-v6";

export async function makeComment(
	this: Context,
	{ body }: MakeCommentArgs,
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

	const comment = new Map([
		["uuid", v6()],
		["author", user.uuid],
		["article", article.uuid],
		["body", body],
		["createdAt", Date.now()],
		["updatedAt", Date.now()],
	]);

	const STATEMENT = `WITH comment AS(
		INSERT INTO ARTICLES_COMMENTS(uuid, author, article, body, created_at, updated_at)
		VALUES($1, $2, $3, $4, $5, $6)
		RETURNING uuid, author, body, created_at, updated_at
	), author AS(
		SELECT 
			uuid AS "author_uuid",
			username,
			bio,
			image
		FROM USERS
		WHERE uuid=(SELECT author FROM comment)
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

	const allResults = await this.pg.query(STATEMENT, [...comment.values()]);

	return new Comment(allResults.rows[0]);
}

interface MakeCommentArgs {
	body: string;
}
