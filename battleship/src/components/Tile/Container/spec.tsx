import { fireEvent, render, screen } from "../../../tests/spec";
import { TileContainer } from ".";
import { Tile } from "..";
import { Position } from "../../../types/ship-layout";

describe("<TileContainer />", () => {
	it("should assign an id and event handlers to its children", () => {
		const shipPositions = [
			{
				coordinates: [0, 0],
				id: 1,
				ship: "cruiser",
			},
		] as Position[];

		render(
			<TileContainer shipPositions={shipPositions}>
				<Tile coordinates={[0, 0]} />
				<Tile coordinates={[0, 1]} />
			</TileContainer>,
		);

		const tileOne = screen.getByTestId("tile-1");
		const tileTwo = screen.getByTestId("tile-2");

		fireEvent.click(tileOne);
		fireEvent.click(tileTwo);

		expect(screen.getByAltText("Hit")).toBeTruthy();
		expect(screen.getByAltText("Miss")).toBeTruthy();
	});
});
