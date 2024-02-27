import type { Point } from "../cartesian-grid";
import { sortCoordinates } from ".";

describe("sortCoordinates", () => {
	it("sorts coordinates by `x` values then `y` values", () => {
		const unsortedCoordinates = [
			[0, 0],
			[1, 0],
			[2, 0],
			[1, 1],
			[0, 1],
			[2, 1],
		] as Point[];
		const sortedCoordinates = [
			[0, 0],
			[0, 1],
			[1, 0],
			[1, 1],
			[2, 0],
			[2, 1],
		] as Point[];

		expect(unsortedCoordinates.sort(sortCoordinates)).toEqual(
			sortedCoordinates,
		);
	});
});
