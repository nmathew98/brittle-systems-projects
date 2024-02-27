import { PlayerCardScore, PlayerCardScoreProps } from "./Score";

export const PlayerCard = ({
	type = "local",
	className = "bg-amber-500",
	label,
}: PlayerCardProps) => (
	<div
		className={`flex w-full flex-col items-center justify-items-center space-y-2 px-4 py-2 lg:aspect-[4/3] lg:space-y-4 lg:py-8 ${className}`}>
		<PlayerCardScore type={type} />
		<div className="h-[0.8px] w-full bg-tundura-600 md:bg-tundura-500 lg:w-3/4" />
		<span className="text-center text-xs font-bold text-tundura-600 md:text-tundura-500 lg:text-2xl">
			{label}
		</span>
	</div>
);

export interface PlayerCardProps {
	label: string;
	type?: PlayerCardScoreProps["type"];
	className?: string;
}
