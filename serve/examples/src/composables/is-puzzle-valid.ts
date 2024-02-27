import { Sudoku } from "../entities/sudoku/sudoku";

export const buildIsPuzzleValid = ({ Sudoku }: { Sudoku: Sudoku }) => {
	return (puzzle: string) => Sudoku.validate(puzzle);
};
