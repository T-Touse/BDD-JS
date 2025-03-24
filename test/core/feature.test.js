const { describe, test, expect,feature,Scenario } = require('../../index');

describe("Scenario", () => {
	test("should instantiate correctly", () => {
		const scenario = new Scenario("Test Scenario");
		expect(scenario).toBeDefined();
	});

	test("should execute a valid scenario", () => {
		const scenario = new Scenario("Valid Scenario")
			.given(() => true)
			.when(function () {
				this.count = 1;
			})
			.then((result) => result.is(1));

		expect(() => scenario.run()).not.toThrow();
	});

	test("should not execute when Given is false", () => {
		const scenario = new Scenario("Invalid Given")
			.given(() => false)
			.when(function () {
				this.count = 1;
			})
			.then((result) => result.is(1));

		expect(() => scenario.run()).toThrow();
	});

	test("should modify context in When", () => {
		const scenario = new Scenario("Modify Context")
			.given(() => true)
			.when(function () {
				this.value = 42;
			})
			.then((result) => result.is(42));

		expect(() => scenario.run()).not.toThrow();
	});

	test("should fail when Then condition is incorrect", () => {
		const scenario = new Scenario("Then Fails")
			.given(() => true)
			.when(function () {
				this.user = "guest";
			})
			.then((result) => result.is("admin"));

		expect(() => scenario.run()).toThrow();
	});
});

describe("Feature", () => {
	test("should run multiple scenarios", () => {
		const authFeature = feature("User Authentication");

		authFeature
			.scenario("Successful login")
			.given(() => true)
			.when(function () {
				//this.user = "admin";
			})
			.then((result) => result.is("admin"));

		authFeature
			.scenario("Failed login")
			.given(() => true)
			.when(function () {
				//this.user = "guest";
			})
			.then((result) => result.is("admin"));

		authFeature.run();

		expect(() => authFeature.run()).not.toThrow();
	});
});
