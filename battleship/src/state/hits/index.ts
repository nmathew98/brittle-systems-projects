import { createSlice } from "@reduxjs/toolkit";

import { globalStore } from "..";

export const hitsSlice = createSlice({
	name: "ships-hits",
	initialState: Object.create(null) as Record<number, boolean>,
	reducers: {
		hit: (state, action) => {
			state[action.payload] = true;
		},
	},
});

export const hitsReducer = hitsSlice.reducer;
export const { hit } = hitsSlice.actions;
export const makeSelectHit =
	(id: number) => (state: ReturnType<typeof globalStore.getState>) =>
		state.hits[id] ?? false;
export const selectNumberOfHits = (
	state: ReturnType<typeof globalStore.getState>,
) => Object.keys(state.hits ?? Object.create(null)).length;
export const makeSelectIsShipHit =
	(tiles: number[]) => (state: ReturnType<typeof globalStore.getState>) =>
		tiles.every(tile => tile in state.hits);
export const makeSelectAreAllShipsHit =
	(numberOfTiles: number) =>
	(state: ReturnType<typeof globalStore.getState>) =>
		Object.keys(state.hits ?? Object.create(null)).length === numberOfTiles;
