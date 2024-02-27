import { CartesianGrid } from ".";

describe("CartesianGrid", () => {
	const grid = new CartesianGrid(2, 2);

	it("assigns coordinates in row order", () => {
		const p1 = grid.next;
		const p2 = grid.next;
		const p3 = grid.next;
		const p4 = grid.next;

		expect(p1).toEqual([0, 0]);
		expect(p2).toEqual([0, 1]);
		expect(p3).toEqual([1, 0]);
		expect(p4).toEqual([1, 1]);
	});

	it("returns null if there are no remaining points on the grid", () => {
		const p5 = grid.next;

		expect(p5).toBeNull();
	});
});
