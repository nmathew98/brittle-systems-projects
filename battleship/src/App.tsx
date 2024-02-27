import { Provider, useSelector } from "react-redux";
import { Fragment } from "react";
import { createPortal } from "react-dom";

import type { Point } from "./utilities/cartesian-grid";
import type { ShipTypes } from "./types/ship-layout";
import { TileContainer } from "./components/Tile/Container";
import { globalStore } from "./state";
import { Tile } from "./components/Tile";
import { HitContainer } from "./components/Hit/Container";
import { HitMarker } from "./components/Hit/Marker";
import { LayoutMd } from "./layouts/Md";
import { Layout } from "./layouts";
import {
	DEFAULT_BREAKPOINTS,
	useScreenBreakpoint,
} from "./hooks/useScreenBreakpoint";
import { HitGroup } from "./components/Hit/Group";
import { PlayerCard } from "./components/Player/Card";
import { PlayerCardContainer } from "./components/Player/Card/Container";
import { LayoutLg } from "./layouts/Lg";
import { Notification } from "./components/Notification";
import { makeSelectAreAllShipsHit } from "./state/hits";

const ROWS = 10;
const COLUMNS = 10;

const grid = new CartesianGrid(ROWS, COLUMNS);

const points = new Array(ROWS * COLUMNS).fill(null).map(() => grid.next);
const positions = getShipPositions(SHIP_LAYOUT);

const positionsGroupedByShips = positions.reduce(
	groupPositions("ships"),
	Object.create(null),
);
const ViewDesktop = () => (
	<LayoutLg>
		<Fragment>
			<PlayerCardContainer>
				<PlayerCard label="player 1" />
				<PlayerCard
					className="bg-emerald-500"
					label="player 2"
					type="external"
				/>
			</PlayerCardContainer>

			<HitGroup>
				{Object.entries(positionsGroupedByShips).map(
					([ship, positions]) => (
						<HitContainer key={ship} ship={ship as ShipTypes}>
							{positions.map(position => (
								<HitMarker key={position.id} id={position.id} />
							))}
						</HitContainer>
					),
				)}
			</HitGroup>
		</Fragment>
		<Fragment>
			<TileContainer shipPositions={positions}>
				{points.map(point => (
					<Tile
						key={TileIdentifier.instance.next(point)}
						coordinates={point as Point}
					/>
				))}
			</TileContainer>
		</Fragment>
	</LayoutLg>
);

const positionsGroupedByMobile = positions.reduce(
	groupPositions("mobile"),
	Object.create(null),
);

const ViewTablet = () => (
	<LayoutMd>
		<Fragment>
			<PlayerCardContainer>
				<PlayerCard label="player 1" />
				<PlayerCard
					className="bg-emerald-500"
					label="player 2"
					type="external"
				/>
			</PlayerCardContainer>{" "}
		</Fragment>
		<Fragment>
			<HitGroup>
				{Object.entries(positionsGroupedByMobile).map(
					([ship, positions]) => (
						<HitContainer key={ship} ship={ship as ShipTypes}>
							{positions.map(position => (
								<HitMarker key={position.id} id={position.id} />
							))}
						</HitContainer>
					),
				)}
			</HitGroup>
		</Fragment>
		<Fragment>
			<TileContainer shipPositions={positions}>
				{points.map(point => (
					<Tile
						key={TileIdentifier.instance.next(point)}
						coordinates={point as Point}
					/>
				))}
			</TileContainer>
		</Fragment>
	</LayoutMd>
);

const ViewMobile = () => (
	<Layout>
		<Fragment>
			<PlayerCardContainer>
				<PlayerCard label="player 1" />
				<PlayerCard
					className="bg-emerald-500"
					label="player 2"
					type="external"
				/>
			</PlayerCardContainer>{" "}
		</Fragment>
		<Fragment>
			<HitGroup>
				{Object.entries(positionsGroupedByMobile).map(
					([ship, positions]) => (
						<HitContainer key={ship} ship={ship as ShipTypes}>
							{positions.map(position => (
								<HitMarker key={position.id} id={position.id} />
							))}
						</HitContainer>
					),
				)}
			</HitGroup>
		</Fragment>
		<Fragment>
			<TileContainer shipPositions={positions}>
				{points.map(point => (
					<Tile
						key={TileIdentifier.instance.next(point)}
						coordinates={point as Point}
					/>
				))}
			</TileContainer>
		</Fragment>
	</Layout>
);

const ShipsHaveSunk = () =>
	createPortal(
		<Notification header="You have sunk all the ships" success>
			Congratulations, you have sunk all the ships!
		</Notification>,
		document.body,
	);

const ResponsiveView = () => {
	const { currentBreakpoint } = useScreenBreakpoint();
	const areAllShipsHit = useSelector(
		makeSelectAreAllShipsHit(positions.length),
	);

	const responsiveViews = {
		[DEFAULT_BREAKPOINTS.Desktop]: ViewDesktop,
		[DEFAULT_BREAKPOINTS.Tablet]: ViewTablet,
		[DEFAULT_BREAKPOINTS.Mobile]: ViewMobile,
		default: ViewMobile,
	};

	const BreakpointView = responsiveViews[currentBreakpoint ?? "default"];

	return (
		<>
			<BreakpointView />
			{areAllShipsHit && <ShipsHaveSunk />}
		</>
	);
};

export const App = () => (
	<Provider store={globalStore}>
		<ResponsiveView />
	</Provider>
);
