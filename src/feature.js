const { TestSuite } = require("./test");

class Scenario {
	#givens = [];
	#whens = [];
	#thens = [];
	constructor(name){
		this.name = name
	}

	#test(value) {
		if (typeof value !== "function") throw new Error("Expected a function");
	}

	given(given) {
		this.#test(given);
		this.#givens.push(given);
		return this;
	}

	when(when) {
		this.#test(when);
		this.#whens.push(when);
		return this;
	}

	then(then) {
		this.#test(then);
		this.#thens.push(then);
		return this;
	}

	#canExec(ctx) {
		return this.#givens.every(callback => callback.apply(ctx));
	}

	exec(ctx = {}) {
		const suite = new TestSuite("Scenario Execution");

		if (!this.#canExec(ctx)) {
			suite.test("Given conditions", () => false);
			return suite.run();
		}
		
		suite.test("When", ()=>{
			this.#whens.forEach(callback => {
				callback.apply(ctx);
			});
		})

		this.#thens.forEach(callback => {
			suite.test("Then condition", () => callback.apply(ctx));
		});

		return suite.run();
	}
}

class Feature {
	constructor(name) {
		this.name = name;
		this.scenarios = [];
	}

	scenario(name, scenarioCallback) {
		const scenario = new Scenario(name);
		scenarioCallback(scenario);
		this.scenarios.push({ name, scenario });
		return this;
	}
	addScenraio(scenario){
		this.scenarios.push({ name:scenario.name, scenario });
	}
	run() {
		console.log(`Feature: ${this.name}`);
		this.scenarios.forEach(({ name, scenario }) => {
			const result = scenario.exec();
			console.log(`  Scenario: ${name} - ${result ? "PASSED" : "FAILED"}`);
		});
	}
}

module.exports = { Feature, Scenario }