import { v6 } from "uuid-v6";

export async function updateArticle(
	this: Context,
	updates: UpdateArticleArgs,
	...records: InstanceType<typeof Collection>[]
) {
	const user = records.find(user => user instanceof User) as InstanceType<
		typeof User
	>;

	if (!user) throw new HTTPError(401, "Unauthorized");

	const filteredUpdates = Object.entries({
		...updates,
	}).filter(([key, value]) => !!value && key !== "tagList" && key !== "slug");

	const counter = new Counter();
	const [SET, parameters] = filteredUpdates.reduce(
		([SET, parameters], [key, value], index, array) => [
			SET + `${key}=$${counter.next}` + delimit(index, array),
			[...parameters, value] as string[],
		],
		["SET ", [] as string[]],
	);

	const hasSlugChanged = !!updates.title;

	const STATEMENT = `UPDATE ARTICLES 
		${SET}, 
			updated_at=$${counter.next}
			${hasSlugChanged ? `, slug=$${counter.next}` : ""}
		WHERE slug=$${counter.next}
		RETURNING slug, uuid`;

	const currentSlug = updates.slug;
	const newSlug = updates.title ? toSlug(updates.title) : updates.slug;

	const _parameters = hasSlugChanged
		? [...parameters, Date.now(), newSlug, currentSlug]
		: [...parameters, Date.now(), currentSlug];

	const allResults = await this.pg.query(STATEMENT, _parameters);

	if (allResults.rows.length !== 1)
		throw new HTTPError(
			500,
			"Internal Server Error",
			"Unexpected error occurred",
		);

	const result = allResults.rows[0];

	const article = new Article(result);

	if (!updates.tagList) return [user, article];

	if (updates.tagList.length === 0) return [user, article, Tag.null];

	const tags = updates.tagList.map(
		tag =>
			new Tag({
				uuid: v6(),
				tag,
			}),
	);

	return [user, article, ...tags];
}

const toSlug = (title: string) => title.toLowerCase().replace(/\s+/g, "-");

interface UpdateArticleArgs {
	slug: string;
	title?: string;
	description?: string;
	body?: string;
	tagList?: string[];
}
