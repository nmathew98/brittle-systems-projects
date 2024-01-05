import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import { ArticlePaginationContainer } from ".";
import { ArticlePaginationItem } from "../Item";

describe("<ArticlePaginationContainer />", () => {
	afterEach(() => {
		cleanup();
	});

	it("is clickable", () => {
		const onClick = vi.fn();

		render(
			<ArticlePaginationContainer>
				<ArticlePaginationItem onClick={onClick}>
					Hello world
				</ArticlePaginationItem>
			</ArticlePaginationContainer>,
		);

		const tab = screen.getByText("Hello world");

		fireEvent.click(tab);

		expect(onClick).toBeCalledTimes(1);
	});

	it("controls which tab is currently marked as active", () => {
		render(
			<ArticlePaginationContainer>
				<ArticlePaginationItem>Hello world</ArticlePaginationItem>
				<ArticlePaginationItem>!!!</ArticlePaginationItem>
			</ArticlePaginationContainer>,
		);

		const firstTabItemInitial = screen.getByText("Hello world");
		const secondTabItemInitial = screen.getByText("!!!");

		expect(firstTabItemInitial).toBeTruthy();
		expect(secondTabItemInitial).toBeTruthy();

		{
			fireEvent.click(firstTabItemInitial);

			const firstTabItemFinal = screen.getByText("Hello world");
			const secondTabItemFinal = screen.getByText("!!!");

			expect(firstTabItemFinal.parentNode.className).toContain("active");
			expect(secondTabItemFinal.parentNode.className).not.toContain("active");
		}

		{
			fireEvent.click(secondTabItemInitial);

			const firstTabItemFinal = screen.getByText("Hello world");
			const secondTabItemFinal = screen.getByText("!!!");

			expect(firstTabItemFinal.parentNode.className).not.toContain("active");
			expect(secondTabItemFinal.parentNode.className).toContain("active");
		}
	});

	it("renders native dom elements correctly", () => {
		render(
			<ArticlePaginationContainer>
				<ArticlePaginationItem>Hello world</ArticlePaginationItem>
				<ArticlePaginationItem>!!!</ArticlePaginationItem>
				<span>AHHH!!!</span>
			</ArticlePaginationContainer>,
		);

		expect(screen.getByText("AHHH!!!")).toBeTruthy();
	});
});
