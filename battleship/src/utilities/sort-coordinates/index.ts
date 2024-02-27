import type { Point } from "../cartesian-grid";

export const sortCoordinates = (a: Point, b: Point) => {
	if (a[0] === b[0]) return a[1] - b[1];

	return a[0] - b[0];
};
