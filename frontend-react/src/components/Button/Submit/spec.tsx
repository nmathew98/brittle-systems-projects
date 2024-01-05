import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import { ButtonSubmit } from ".";

describe("<ButtonSubmit />", () => {
	afterEach(() => {
		cleanup();
	});

	it("is clickable", () => {
		const onClick = vi.fn();

		render(<ButtonSubmit onClick={onClick}>Submit</ButtonSubmit>);

		const cancelButton = screen.getByText("Submit");

		fireEvent.click(cancelButton);

		expect(onClick).toBeCalledTimes(1);
	});
});
