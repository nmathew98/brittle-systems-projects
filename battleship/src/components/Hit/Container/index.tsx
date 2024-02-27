import type { ReactElement, ReactNode } from "react";
import { Children } from "react";

import type { ShipTypes } from "../../../types/ship-layout";
import { Ship } from "../../Ship";
import { HitMarkerProps } from "../Marker";
import { useSelector } from "react-redux";
import { makeSelectIsShipHit } from "../../../state/hits";
import { Notification } from "../../Notification";
import { createPortal } from "react-dom";

export const HitContainer = ({ ship, children }: HitContainerProps) => {
	const hits = Children.map(children, child => {
		const props = (child as ReactElement).props as HitMarkerProps;

		return props.id;
	});
	const isShipHit = useSelector(makeSelectIsShipHit(hits ?? []));

	return (
		<div className="grid grid-cols-2 items-center gap-x-2 lg:mx-4 lg:mt-4 lg:gap-x-0">
			<Ship className="h-auto w-5/6 lg:-ml-4" type={ship} />
			<div className="space-between flex items-center lg:my-2">
				{children}
			</div>
			{!!isShipHit &&
				createPortal(
					<Notification
						header={`${formatShipName(ship)} is down!`}
						success>
						You have sunk the {formatShipName(ship)}!
					</Notification>,
					document.body,
				)}
		</div>
	);
};

interface HitContainerProps {
	ship: ShipTypes;
	children?: ReactNode;
}

const formatShipName = (ship: ShipTypes) =>
	`${ship.charAt(0).toUpperCase()}${ship.slice(1)}`;
