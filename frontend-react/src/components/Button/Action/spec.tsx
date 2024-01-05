import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import { ButtonAction } from ".";

describe("<ButtonAction />", () => {
	afterEach(() => {
		cleanup();
	});

	it("is clickable", () => {
		const onClick = vi.fn();

		render(<ButtonAction onClick={onClick}>Action button!</ButtonAction>);

		const actionButton = screen.getByText("Action button!");

		fireEvent.click(actionButton);

		expect(onClick).toBeCalledTimes(1);
	});
});
