import type { ReactNode } from "react";

export const PlayerCardContainer = ({ children }: PlayerCardContainerProps) => (
	<div className="flex items-center">{children}</div>
);

export interface PlayerCardContainerProps {
	children?: ReactNode;
}
