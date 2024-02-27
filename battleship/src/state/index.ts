import { configureStore } from "@reduxjs/toolkit";

import { hitsReducer } from "./hits";
import { missReducer } from "./miss";

export const globalStore = configureStore({
	reducer: {
		hits: hitsReducer,
		miss: missReducer,
	},
});
