const { Report } = require("./test");

class Scenario {
	#givens = [];
	#whens = [];
	#thens = [];

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
		if (!this.#canExec(ctx)) return false;
		this.#whens.forEach(callback => callback.apply(ctx));
		return this.#thens.every(callback => callback.apply(ctx));
	}
}

class Feature {
	constructor(name) {
		this.name = name;
		this.scenarios = [];
	}

	scenario(name, scenarioCallback) {
		const scenario = new Scenario();
		scenarioCallback(scenario);
		this.scenarios.push({ name, scenario });
		return this;
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