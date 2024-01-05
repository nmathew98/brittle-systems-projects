import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import { Button } from ".";

describe("<Button />", () => {
	afterEach(() => {
		cleanup();
	});

	it("is clickable", () => {
		const onClick = vi.fn();

		render(<Button onClick={onClick}>Submit</Button>);

		const button = screen.getByText("Submit");

		fireEvent.click(button);

		expect(onClick).toBeCalledTimes(1);
	});
});
