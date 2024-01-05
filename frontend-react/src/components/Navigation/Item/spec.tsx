import React from "react";
import { screen, cleanup } from "@testing-library/react";

import { NavigationItem } from ".";

describe("<NavigationItem />", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders if link is not active", () => {
		render(
			<NavigationItem href="test" icon="test">
				Test
			</NavigationItem>,
		);

		const element = screen.getByText("Test");

		expect(element).toBeTruthy();
		expect(element.href).toStrictEqual("/test");
		expect(element.className).toStrictEqual("nav-link");

		const icon = element.children[0];
		expect(icon.className).toStrictEqual("test");
	});

	it("renders if link is active", () => {
		render(
			<NavigationItem href="test" icon="test" isActive>
				Test
			</NavigationItem>,
		);

		const element = screen.getByText("Test");

		expect(element).toBeTruthy();
		expect(element.href).toStrictEqual("/test");
		expect(element.className).toStrictEqual("nav-link active");

		const icon = element.children[0];
		expect(icon.className).toStrictEqual("test");
	});
});
