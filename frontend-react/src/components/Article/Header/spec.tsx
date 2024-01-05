import React from "react";
import { screen, cleanup } from "@testing-library/react";

import { ArticleHeader } from ".";

describe("<ArticleHeader />", () => {
	afterEach(() => {
		cleanup();
	});

	it("createdAt is formatted like 'January 29th, 2023'", () => {
		const currentDate = new Date(1677136760660);

		render(<ArticleHeader createdAt={currentDate} />);

		expect(screen.getByText("February 23rd, 2023")).toBeTruthy();
	});
});
