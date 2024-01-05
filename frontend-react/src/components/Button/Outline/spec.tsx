import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import { ButtonOutline } from ".";

describe("<ButtonOutline />", () => {
	afterEach(() => {
		cleanup();
	});

	it("is clickable", () => {
		const onClick = vi.fn();

		render(<ButtonOutline onClick={onClick}>Submit</ButtonOutline>);

		const cancelButton = screen.getByText("Submit");

		fireEvent.click(cancelButton);

		expect(onClick).toBeCalledTimes(1);
	});
});
