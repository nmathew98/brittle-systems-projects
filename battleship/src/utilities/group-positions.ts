import type { Position, ShipTypes } from "../types/ship-layout";

export const groupPositions = (by: "mobile" | "ships") => {
	switch (by) {
		case "mobile": {
			return groupByMobile;
		}
		case "ships": {
			return groupByShips;
		}
		default: {
			return groupByShips;
		}
	}
};

const groupByMobile = (
	grouped: Record<ShipTypes, Position[]>,
	position: Position,
	idx: number,
	arr: Position[],
) => {
	const _grouped = {
		...grouped,
		[position.ship]: [...(grouped[position.ship] ?? []), position],
	};

	if (idx === arr.length - 1)
		return {
			carrier: _grouped.carrier,
			submarine: _grouped.submarine,
			battleship: _grouped.battleship,
			destroyer: _grouped.destroyer,
			cruiser: _grouped.cruiser,
		};

	return _grouped;
};

const groupByShips = (
	grouped: Record<ShipTypes, Position[]>,
	position: Position,
) => ({
	...grouped,
	[position.ship]: [...(grouped[position.ship] ?? []), position],
});
