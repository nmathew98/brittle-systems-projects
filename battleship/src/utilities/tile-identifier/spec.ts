describe("TileIdentifier", () => {
	const tileIdentifier = TileIdentifier.instance;

	it("assigns new identifiers to different coordinates", () => {
		const p1 = tileIdentifier.next([0, 0]);
		const p2 = tileIdentifier.next([0, 1]);

		expect(p1).not.toEqual(p2);
	});

	it("assigns same identifiers to same coordinates", () => {
		const p1 = tileIdentifier.next([0, 0]);
		const p2 = tileIdentifier.next([0, 0]);

		expect(p1).toEqual(p2);
	});

	it("is a singleton", () => {
		const newTileIdentifier = TileIdentifier.instance;

		expect(tileIdentifier).toEqual(newTileIdentifier);
	});
});
