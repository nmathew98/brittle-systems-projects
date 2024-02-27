import { cleanup, render, screen } from "../../../tests/spec";
import { HitMarker } from ".";

describe("<HitMarker />", () => {
	beforeEach(cleanup);

	it("should render child when not hit", () => {
		render(<HitMarker id={1} />);

		expect(screen.getByAltText("Not Hit")).toBeTruthy();
		expect(() => screen.getByLabelText("Hit")).toThrow();
	});

	it("should render child when hit", async () => {
		render(<HitMarker id={2} />, { preloadedState: { hits: { 2: true } } });

		expect(() => screen.getByAltText("Not Hit")).toThrow();
		expect(screen.getByLabelText("Hit")).toBeTruthy();
	});
});
