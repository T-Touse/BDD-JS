import { test, expect } from "bun:test";
import { Feature, Scenario } from "../src/feature";

// Teste que Scenario peut être instancié
test("Scenario - should instantiate correctly", () => {
	const scenario = new Scenario();
	expect(scenario).toBeDefined();
});

// Teste l'ajout et l'exécution des étapes Given, When, Then
test("Scenario - should execute a valid scenario", () => {
	const scenario = new Scenario()
		.given(() => true)
		.when(function () { this.count = 1; })
		.then(function () { return this.count === 1; });

	expect(scenario.exec().toString()).toContain("PASSED");
});

// Teste si Given empêche l'exécution quand il est faux
test("Scenario - should not execute when Given is false", () => {
	const scenario = new Scenario()
		.given(() => false)
		.when(function () { this.count = 1; })
		.then(function () { return this.count === 1; });

	expect(scenario.exec().toString()).toContain("FAILED");
});

// Teste l'exécution de plusieurs scénarios dans une Feature
test("Feature - should run multiple scenarios", () => {
	const feature = new Feature("Test Feature")
		.scenario("Scenario 1", scenario => {
			scenario.given(() => true).when(() => { }).then(() => true);
		})
		.scenario("Scenario 2", scenario => {
			scenario.given(() => true).when(() => { }).then(() => false);
		});

	expect(feature.scenarios[0].scenario.exec().toString()).toContain("PASSED");
	expect(feature.scenarios[1].scenario.exec().toString()).toContain("FAILED");
});

// Vérifie que When modifie bien le contexte
test("Scenario - should modify context in When", () => {
	const scenario = new Scenario()
		.given(() => true)
		.when(function () { this.value = 42; })
		.then(function () { return this.value === 42; });

	expect(scenario.exec().toString()).toContain("PASSED");
});

// Teste un scénario de connexion réussi
test("Scenario - Successful execution", () => {
	const scenario = new Scenario()
		.given(() => true)
		.when(function () { this.user = "admin"; })
		.then(function () { return this.user === "admin"; });

	expect(scenario.exec().toString()).toContain("PASSED");
});

// Teste un scénario où la condition Given est fausse
test("Scenario - Fails when given condition is false", () => {
	const scenario = new Scenario()
		.given(() => false)
		.when(function () { this.user = "admin"; })
		.then(function () { return this.user === "admin"; });

	expect(scenario.exec().toString()).toContain("FAILED");
});

// Teste un scénario où la condition Then échoue
test("Scenario - Then condition fails", () => {
	const scenario = new Scenario()
		.given(() => true)
		.when(function () { this.user = "guest"; })
		.then(function () { return this.user === "admin"; });

	expect(scenario.exec().toString()).toContain("FAILED");
});

// Teste l'exécution de plusieurs scénarios dans une Feature
test("Feature - Runs multiple scenarios", () => {
	const feature = new Feature("User authentication")
		.scenario("Successful login", scenario => {
			scenario
				.given(() => true)
				.when(function () { this.user = "admin"; })
				.then(function () { return this.user === "admin"; });
		})
		.scenario("Failed login", scenario => {
			scenario
				.given(() => true)
				.when(function () { this.user = "guest"; })
				.then(function () { return this.user === "admin"; });
		});

	feature.run();

	expect(feature.scenarios[0].scenario.exec().toString()).toContain("PASSED");
	expect(feature.scenarios[1].scenario.exec().toString()).toContain("FAILED");
});