import { defineMutation, gql } from "@skulpture/serve";

export default defineMutation({
	definition: gql`solvePuzzle(uuid: ID!, puzzle: String!): String!`,
	resolve: async ({ uuid, puzzle }, context) => {
		const User = context.useModule("User");
		const Sudoku = context.useModule("Sudoku");

		const solvePuzzle = buildSolvePuzzle({ User, Sudoku });

		await solvePuzzle(puzzle, { uuid });
	},
});
