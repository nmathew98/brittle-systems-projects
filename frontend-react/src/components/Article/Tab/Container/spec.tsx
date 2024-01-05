import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import { ArticleTabContainer } from ".";
import { ArticleTabItem } from "../Item";

describe("<ArticleTabContainer />", () => {
	afterEach(() => {
		cleanup();
	});

	it("is clickable", () => {
		const onClick = vi.fn();

		render(
			<ArticleTabContainer>
				<ArticleTabItem onClick={onClick}>Hello world</ArticleTabItem>
			</ArticleTabContainer>,
		);

		const tab = screen.getByText("Hello world");

		fireEvent.click(tab);

		expect(onClick).toBeCalledTimes(1);
	});

	it("controls which tab is currently marked as active", () => {
		render(
			<ArticleTabContainer>
				<ArticleTabItem>Hello world</ArticleTabItem>
				<ArticleTabItem>!!!</ArticleTabItem>
			</ArticleTabContainer>,
		);

		const firstTabItemInitial = screen.getByText("Hello world");
		const secondTabItemInitial = screen.getByText("!!!");

		expect(firstTabItemInitial).toBeTruthy();
		expect(secondTabItemInitial).toBeTruthy();

		{
			fireEvent.click(firstTabItemInitial);

			const firstTabItemFinal = screen.getByText("Hello world");
			const secondTabItemFinal = screen.getByText("!!!");

			expect(firstTabItemFinal.className).toContain("active");
			expect(secondTabItemFinal.className).not.toContain("active");
		}

		{
			fireEvent.click(secondTabItemInitial);

			const firstTabItemFinal = screen.getByText("Hello world");
			const secondTabItemFinal = screen.getByText("!!!");

			expect(firstTabItemFinal.className).not.toContain("active");
			expect(secondTabItemFinal.className).toContain("active");
		}
	});

	it("renders native dom elements correctly", () => {
		render(
			<ArticleTabContainer>
				<ArticleTabItem>Hello world</ArticleTabItem>
				<ArticleTabItem>!!!</ArticleTabItem>
				<span>AHHH!!!</span>
			</ArticleTabContainer>,
		);

		expect(screen.getByText("AHHH!!!")).toBeTruthy();
	});
});
