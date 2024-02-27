import type { Position, ShipLayout } from "../../types/ship-layout";

export const getShipPositions = (data: ShipLayout) =>
	data.layout
		.map(layout =>
			layout.positions.map(position => ({
				ship: layout.ship,
				coordinates: position,
				id: TileIdentifier.instance.next(position),
			})),
		)
		.flat() as Position[];
