import { Title } from "react-head";

import { LayoutHome } from "../../layouts/Home";
import { Articles } from "../../components/Article";

// Everytime a filter (which is reflected in the URL changes), `Body` rerenders
export const Home = () => (
	<LayoutHome>
		<Title>Home - {BRAND_NAME}</Title>
		<Articles />
	</LayoutHome>
);
