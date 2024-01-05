import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

export const LayoutBase = ({ children }) => (
	<>
		<Navigation />
		{children}
		<Footer />
	</>
);
