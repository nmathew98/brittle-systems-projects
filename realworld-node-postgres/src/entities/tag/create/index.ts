export async function makeTag(
	this: Context,
	_: undefined,
	...records: InstanceType<typeof Collection>[]
) {
	const user = records.find(user => user instanceof User) as InstanceType<
		typeof User
	>;
	const article = records.find(
		article => article instanceof Article,
	) as InstanceType<typeof Article>;
	const tags = records.filter(tag => tag instanceof Tag) as InstanceType<
		typeof Tag
	>[];

	if (!article) throw new Error("Article not specified");
	if (!user) throw new Error("User not specified");
	if (tags.length === 0) return [article, user];

	if (tags.includes(Tag.null)) {
		const TAGS_TO_DELETE_STATEMENT = `DELETE FROM ARTICLES_TAGS WHERE article=$1`;

		await this.pg.query(TAGS_TO_DELETE_STATEMENT, [article.uuid]);

		return [article, user];
	}

	const deleteTagsCounter = new Counter();
	const insertTagsCounter = new Counter();

	const [DELETE_STATEMENT, TAGS_TO_DELETE] = tags.reduce(
		([DELETE, parameters], tag, index, array) =>
			[
				(DELETE +
					`tag!=$${deleteTagsCounter.next}` +
					delimit(index, array, " OR ")) as string,
				[...parameters, tag.value],
			] as [string, string[]],
		["", []] as [string, string[]],
	);
	const [INSERT_STATEMENT, TAGS_TO_INSERT] = tags.reduce(
		([VALUES, parameters], tag, index, array) =>
			[
				VALUES +
					`($${insertTagsCounter.next}, $${insertTagsCounter.next}, $${insertTagsCounter.next})` +
					delimit(index, array),
				[...parameters, tag.uuid, tag.value, article.uuid],
			] as [string, string[]],
		["", []] as [string, string[]],
	);

	const TAGS_TO_DELETE_STATEMENT = `DELETE FROM ARTICLES_TAGS
		WHERE (
			article=$${deleteTagsCounter.next}
			AND
			(${DELETE_STATEMENT})
		)`;
	const TAGS_TO_INSERT_STATEMENT = `INSERT INTO ARTICLES_TAGS(uuid, tag, article) 
		VALUES ${INSERT_STATEMENT}
		ON CONFLICT(article, tag)
			DO NOTHING`;

	const TRANSACTION = async () => {
		try {
			await this.pg.query("BEGIN");
			await this.pg.query(TAGS_TO_DELETE_STATEMENT, [
				...TAGS_TO_DELETE,
				article.uuid,
			]);
			await this.pg.query(TAGS_TO_INSERT_STATEMENT, TAGS_TO_INSERT);
			await this.pg.query("COMMIT");
		} catch (error: unknown) {
			await this.pg.query("ROLLBACK");
			throw error;
		}
	};

	await TRANSACTION();

	return [article, user];
}
