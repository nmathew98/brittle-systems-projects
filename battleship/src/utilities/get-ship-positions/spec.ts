describe("getShipPositions", () => {
	it("transforms ship layout position data into an array of `Position`", () => {
		const positions = getShipPositions(SHIP_LAYOUT);

		const shipTypes = Object.values(SHIP_TYPES).map(
			shipType => shipType.description,
		);

		positions.forEach(position => {
			expect(shipTypes).toContain(position.ship);
			expect(Array.isArray(position.coordinates)).toBeTruthy();
			expect(position.id).toBeTypeOf("number");
		});
	});
});
