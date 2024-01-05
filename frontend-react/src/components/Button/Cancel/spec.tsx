import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import { ButtonCancel } from ".";

describe("<ButtonCancel />", () => {
	afterEach(() => {
		cleanup();
	});

	it("is clickable", () => {
		const onClick = vi.fn();

		render(
			<ButtonCancel onClick={onClick}>Or click here to logout.</ButtonCancel>,
		);

		const cancelButton = screen.getByText("Or click here to logout.");

		fireEvent.click(cancelButton);

		expect(onClick).toBeCalledTimes(1);
	});
});
