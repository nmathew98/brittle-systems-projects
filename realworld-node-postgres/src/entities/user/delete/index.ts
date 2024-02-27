export async function unfollowUser(
	this: Context,
	{ username }: UnfollowUserArgs,
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

	const userToUnfollow = new User(allFollowsToResult.rows[0]);

	if (!userToUnfollow) throw new Error(`Unable to find user \`${username}\``);

	const STATEMENT_UNFOLLOWS = `UPDATE USERS_FOLLOWS SET is_active=$1 WHERE (origin=$2 AND destination=$3)`;

	await this.pg.query(STATEMENT_UNFOLLOWS, [
		false,
		userWhoIsFollowing.uuid,
		userToUnfollow.uuid,
	]);
}

interface UnfollowUserArgs {
	username: string;
}
