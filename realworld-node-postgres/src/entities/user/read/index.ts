export async function getProfile(
	this: Context,
	{ username }: Partial<GetProfileArgs>,
	...records: InstanceType<typeof Collection>[]
) {
	const user = records.find(user => user instanceof User) as InstanceType<
		typeof User
	>;

	if (!user && !username) throw new Error("No user specified");

	const FIELDS_TO_SELECT = [
		"uuid",
		"bio",
		"image",
		user?.username ? "" : "username",
		user?.email ? "" : "email",
	]
		.filter(Boolean)
		.join(", ");

	const STATEMENT = `SELECT ${FIELDS_TO_SELECT} FROM USERS WHERE (uuid=$1 OR username=$2)`;

	const allResults = await this.pg.query(STATEMENT, [user?.uuid, username]);

	if (allResults.rows.length === 0) throw new Error("Invalid user specified");

	const randomUserProfile = allResults.rows.find(
		row => row.username === username,
	);
	const currentUserProfile = allResults.rows.find(
		row => row.uuid === user?.uuid,
	);

	if (user && username) {
		if (!randomUserProfile?.uuid)
			throw new Error("Invalid user specified");

		const STATEMENT = `SELECT is_active FROM USERS_FOLLOWS WHERE (origin=$1 AND destination=$2)`;

		const allFollowingResults = await this.pg.query(STATEMENT, [
			currentUserProfile?.uuid,
			randomUserProfile?.uuid,
		]);

		if (allFollowingResults.rows.length > 1)
			throw new Error(
				"Unexpected error: More than 1 following relationship found",
			);

		const isFollowing = allFollowingResults.rows[0];

		return new User({
			...randomUserProfile,
			isFollowing: !!isFollowing?.is_active,
		});
	}

	return new User({
		...user,
		...currentUserProfile,
		isFollowing: false,
	});
}

interface GetProfileArgs {
	username: string | null;
}
