import { gql, defineMutation } from "@skulpture/serve";

export default defineMutation({
	definition: gql`createUser(name: String!): Boolean!`,
	types: gql`
		input UserUpdateInput {
			uuid: ID!
			password: String
			email: String
		}
	`,
	resolve: async ({ user }, context) => {
		const Logger = context.useModule("Logger");
		const User = context.useModule("User");

		const updateUser = buildUpdateUser({ User });

		try {
			return await updateUser({ uuid: user.uuid }, user);
		} catch (error: any) {
			Logger.error(error.message);

			return false;
		}
	},
});
