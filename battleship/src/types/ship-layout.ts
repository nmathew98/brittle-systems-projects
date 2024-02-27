import type { Point } from "../utilities/cartesian-grid";

export interface ShipLayout {
	shipTypes: {
		carrier: ShipLayoutType;
		battleship: ShipLayoutType;
		cruiser: ShipLayoutType;
		submarine: ShipLayoutType;
		destroyer: ShipLayoutType;
	};
	layout: ShipLayoutPosition[];
}

export type ShipTypes = keyof Pick<ShipLayout, "shipTypes">["shipTypes"];

export interface ShipLayoutType {
	size: number;
	count: number;
}

export interface ShipLayoutPosition {
	ship: ShipTypes;
	positions: Point[];
}

export interface Position {
	coordinates: Point;
	ship: ShipTypes;
	id: number;
}
