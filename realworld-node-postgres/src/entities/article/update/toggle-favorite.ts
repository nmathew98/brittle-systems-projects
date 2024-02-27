import { v6 } from "uuid-v6";

export async function toggleFavorite(
	this: Context,
	{ isFavorited }: ToggleFavoriteArgs,
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

	const articlesFavorite = new Map([
		["uuid", v6()],
		["article", article.uuid],
		["favorited_by", user.uuid],
		["is_active", isFavorited],
	]);

	const STATEMENT = `WITH is_favorited AS(
		SELECT is_active FROM ARTICLES_FAVORITES WHERE article=$2 AND favorited_by=$3
	)
	INSERT INTO ARTICLES_FAVORITES(uuid, article, favorited_by, is_active) 
		VALUES($1, $2, $3, COALESCE($4, TRUE))
		ON CONFLICT(article, favorited_by)
			DO UPDATE
				SET is_active=COALESCE($4, NOT (SELECT is_active FROM is_favorited))`;

	await this.pg.query(STATEMENT, [...articlesFavorite.values()]);

	return records;
}

interface ToggleFavoriteArgs {
	isFavorited: boolean | null;
}
