import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import { HeadProvider } from "react-head";

import { router } from "./router";
import { Context } from "./context";

const queryClient = new QueryClient();

export const App = () => (
	<QueryClientProvider client={queryClient}>
		<HeadProvider>
			<Context>
				<RouterProvider router={router} />
			</Context>
		</HeadProvider>
	</QueryClientProvider>
);
