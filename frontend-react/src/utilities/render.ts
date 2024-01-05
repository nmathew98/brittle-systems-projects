import { MemoryRouter } from "react-router-dom";
import { render as testingLibraryRender } from "@testing-library/react";

export const render = (component: any) =>
	testingLibraryRender(component, { wrapper: MemoryRouter });
