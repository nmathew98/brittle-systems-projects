import { gql, defineQuery } from "@skulpture/serve";

export default defineQuery({
	definition: gql`isPuzzleValid(row: String, column: Int, value: Int, puzzle: String!): IsPuzzleValid`,
	types: gql`
		type IsPuzzleValid {
			placement: Boolean
			puzzle: Boolean
		}
	`,
	resolve: ({ puzzle, row, column, value }, context) => {
		const Sudoku = context.useModule("Sudoku");

		const isPlacementValid = buildIsPlacementValid({ Sudoku });
		const isPuzzleValid = buildIsPuzzleValid({ Sudoku });

		let placementValid: boolean | null = null;

		if (puzzle && row && column && value)
			placementValid = isPlacementValid(puzzle, row, column, value);

		const puzzleValid = isPuzzleValid(puzzle);

		return {
			placement: placementValid,
			puzzle: puzzleValid,
		};
	},
});
