import type { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";

import type { globalStore } from "../../state";
import { hitsReducer } from "../../state/hits";
import { missReducer } from "../../state/miss";

export const Providers = ({
	preloadedState = undefined,
	children,
}: ProvidersProps) => {
	const store = configureStore({
		reducer: {
			hits: hitsReducer,
			miss: missReducer,
		},
		preloadedState,
	});

	return <ReduxProvider store={store}>{children}</ReduxProvider>;
};

interface ProvidersProps {
	children?: ReactNode;
	preloadedState?: Partial<ReturnType<typeof globalStore.getState>>;
}

const customRender = (
	ui: Parameters<typeof render>[0],
	options?: Parameters<typeof render>[1] &
		Pick<ProvidersProps, "preloadedState">,
) => {
	const _Providers = ({ children }: any) => (
		<Providers preloadedState={options?.preloadedState}>
			{children}
		</Providers>
	);

	return render(ui, { wrapper: _Providers, ...options });
};

/* eslint-disable react-refresh/only-export-components */
export * from "@testing-library/react";
export { customRender as render };
