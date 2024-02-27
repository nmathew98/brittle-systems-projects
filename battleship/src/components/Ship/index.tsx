import type { ShipTypes } from "../../types/ship-layout";
import destroyer from "../../assets/destroyer.png";
import battleship from "../../assets/battleship.png";
import carrier from "../../assets/carrier.png";
import cruiser from "../../assets/cruiser.png";
import submarine from "../../assets/submarine.png";

export const Ship = ({ className, type }: ShipProps) => (
	<img
		className={className}
		src={SHIP_TYPES[type]}
		alt={transformAltText(type)}
		width={SHIP_DIMENSIONS[type].width}
		height={SHIP_DIMENSIONS[type].height}
	/>
);

interface ShipProps {
	className?: string;
	type: ShipTypes;
}

const SHIP_TYPES: { [key in ShipTypes]: string } = {
	destroyer: carrier,
	battleship: battleship,
	carrier: destroyer,
	cruiser: cruiser,
	submarine: submarine,
};

const SHIP_DIMENSIONS: {
	[key in ShipTypes]: { width: number; height: number };
} = {
	destroyer: {
		width: 480,
		height: 128,
	},
	battleship: {
		width: 480,
		height: 128,
	},
	carrier: {
		width: 480,
		height: 128,
	},
	cruiser: {
		width: 480,
		height: 128,
	},
	submarine: {
		width: 480,
		height: 128,
	},
};

const transformAltText = (type: ShipTypes) =>
	`${type.charAt(0).toUpperCase()}${type.slice(1)}`;
