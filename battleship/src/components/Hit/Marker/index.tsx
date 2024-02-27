import { useSelector } from "react-redux";
import { XMarkIcon } from "@heroicons/react/20/solid";

import { makeSelectHit } from "../../../state/hits";
import missIconSmall from "../../../assets/miss-64.png";

export const HitMarker = ({ id }: HitMarkerProps) => {
	const isHit = useSelector(makeSelectHit(id as number));

	return (
		<>
			{!!isHit && (
				<div className="h-auto w-1/6">
					<XMarkIcon
						className="h-auto w-auto text-red-500"
						aria-label="Hit"
					/>
				</div>
			)}
			{!isHit && (
				<img
					className="h-auto w-1/6"
					src={missIconSmall}
					alt="Not Hit"
					width="64"
					height="64"
				/>
			)}
		</>
	);
};

export interface HitMarkerProps {
	id: number;
}
