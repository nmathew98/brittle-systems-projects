import { defineQuery, gql } from "@skulpture/serve";

export default defineQuery({
	definition: gql`whoami(uuid: ID!): UserDetails!`,
	types: gql`
		type UserDetails {
			uuid: ID!
			email: String!
			password: String!
			puzzle: String!
		}
	`,
	resolve: async ({ uuid }, context) => {
		const User = context.useModule("User");

		const findUser = buildFindUser({ User });

		return (await findUser({ uuid }))?.pop();
	},
});
