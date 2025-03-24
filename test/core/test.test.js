import { describe, test } from "../../src/core/test";

describe("Math Utils", () => {
	test("Addition should work", () => {
		const result = 1 + 1;
		if (result !== 2) throw new Error("Expected 2");
	});

	describe("Multiplication", () => {
		test("Multiplication should work", () => {
			const result = 2 * 3;
			if (result !== 6) throw new Error("Expected 6");
		});
	});
});
