import { createSlice } from "@reduxjs/toolkit";

import { globalStore } from "..";

export const missSlice = createSlice({
	name: "ships-miss",
	initialState: Object.create(null) as Record<number, boolean>,
	reducers: {
		miss: (state, action) => {
			state[action.payload] = true;
		},
	},
});

export const missReducer = missSlice.reducer;
export const { miss } = missSlice.actions;
export const makeSelectMissedHit =
	(id: number) => (state: ReturnType<typeof globalStore.getState>) =>
		state.miss[id] ?? false;
