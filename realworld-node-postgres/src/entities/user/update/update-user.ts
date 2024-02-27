export async function updateUser(
	this: Context,
	updates: Partial<UpdateUserArgs>,
	...records: InstanceType<typeof Collection>[]
) {
	const user = records.find(user => user instanceof User) as InstanceType<
		typeof User
	>;

	if (!user) throw new Error("User not found");

	const filteredUpdates = await Promise.all(
		Object.entries(updates)
			.filter(([, value]) => !!value)
			.map(async ([key, value]) => {
				if (key === "password") {
					const hashedPassword = await this.hasher.hash(value);

					return [key, hashedPassword];
				}

				return [key, value];
			}),
	);

	const counter = new Counter();
	const [SET, parameters] = filteredUpdates.reduce(
		([SET, parameters], [key, value], index, array) =>
			[
				SET + `${key}=$${counter.next}` + delimit(index, array),
				[...parameters, value],
			] as [string, string[]],
		["SET ", []] as [string, string[]],
	);

	const STATEMENT = `UPDATE USERS 
		${SET}
		WHERE uuid=$${counter.next}
		RETURNING uuid, username, email, password, image, bio`;

	const allResults = await this.pg.query(STATEMENT, [...parameters, user.uuid]);

	if (allResults.rows.length !== 1)
		throw new HTTPError(
			500,
			"Internal Server Error",
			"Unexpected error occurred",
		);

	const result = allResults.rows[0];

	return new User(result);
}

interface UpdateUserArgs {
	email: string;
	username: string;
	password: string;
	image: string;
	bio: string;
}
