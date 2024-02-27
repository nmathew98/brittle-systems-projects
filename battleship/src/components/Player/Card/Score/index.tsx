import { useSelector } from "react-redux";

import { selectNumberOfHits } from "../../../../state/hits";

export const PlayerCardScore = ({ type }: PlayerCardScoreProps) => {
	const selector = selectors[type];
	const hits = useSelector(selector) as number;

	return (
		<span className="text-center text-3xl font-bold text-tundura-600 md:text-tundura-500 lg:text-8xl">
			{formatScore(hits)}
		</span>
	);
};

export interface PlayerCardScoreProps {
	type: "local" | "external";
}

const formatScore = (score: number) => (score < 10 ? `0${score}` : `${score}`);
const selectors = {
	local: selectNumberOfHits,
	external: () => 0,
};
