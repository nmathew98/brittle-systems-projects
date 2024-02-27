export async function followUser(
	this: Context,
	{ username }: FollowUserArgs,
	...records: InstanceType<typeof Collection>[]
) {
	const userWhoIsFollowing = records.find(
		user => user instanceof User,
	) as InstanceType<typeof User>;

	if (!userWhoIsFollowing) throw new HTTPError(401, "Unauthorized");

	if (!username) throw new Error("Parameter `username` not specified");

	const STATEMENT_FOLLOWS_TO = `SELECT uuid FROM USERS WHERE username=$1`;

	const allFollowsToResult = await this.pg.query(STATEMENT_FOLLOWS_TO, [
		username,
	]);

	if (allFollowsToResult.rows.length !== 1) throw new Error("Invalid username");

	const userToFollow = new User(allFollowsToResult.rows[0]);

	if (!userToFollow) throw new Error(`Unable to find user \`${username}\``);

	const STATEMENT_FOLLOWS = `INSERT INTO USERS_FOLLOWS(origin, destination, is_active)
		VALUES($1, $2, $3)
		ON CONFLICT (origin, destination)
		DO UPDATE SET is_active=$3`;

	await this.pg.query(STATEMENT_FOLLOWS, [
		userWhoIsFollowing.uuid,
		userToFollow.uuid,
		true,
	]);
}

interface FollowUserArgs {
	username: string;
}
