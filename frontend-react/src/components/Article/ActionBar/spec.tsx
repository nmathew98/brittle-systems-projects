import React from "react";
import { screen, cleanup } from "@testing-library/react";

import { ArticleActionBar } from ".";

describe("<ArticleActionBar />", () => {
	afterEach(() => {
		cleanup();
	});

	it("createdAt is formatted like 'January 29th, 2023'", () => {
		const currentDate = new Date(1677136760660);

		render(<ArticleActionBar createdAt={currentDate} />);

		expect(screen.getByText("February 23rd, 2023")).toBeTruthy();
	});
});
