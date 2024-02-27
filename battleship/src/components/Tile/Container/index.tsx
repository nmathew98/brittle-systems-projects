import type { ReactElement, ReactNode } from "react";
import { Children, cloneElement } from "react";
import { useDispatch } from "react-redux";

import type { Position } from "../../../types/ship-layout";
import type { TileProps } from "../index";
import { hit } from "../../../state/hits";
import { miss } from "../../../state/miss";

export const TileContainer = ({
	shipPositions,
	children,
}: TileContainerProps) => {
	const dispatch = useDispatch();

	return (
		<div className="grid grid-cols-10 border-amber-500 md:border-8">
			{Children.map<ReactNode, ReactNode>(children, child => {
				if (!child || typeof (child as ReactElement).type === "string")
					return child;

				const props = (child as ReactElement).props as TileProps;
				const tileId = TileIdentifier.instance.next(props.coordinates);
				const isOccupiedByShip = shipPositions.find(
					position => position.id === tileId,
				);
				const onClick = () => {
					if (isOccupiedByShip) dispatch(hit(tileId));
					else dispatch(miss(tileId));
				};

				return cloneElement(child as ReactElement, {
					...props,
					id: tileId,
					onClick,
				});
			})}
		</div>
	);
};

interface TileContainerProps {
	children?: ReactNode;
	shipPositions: Position[];
}
