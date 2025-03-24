const { describe, test, expect } = require("bun:test");

export enum ContextMode {
	add,
	replace,
}

abstract class UseContext {
	#context = new Map<string, any>();
	get context(){
		return this.#context
	}

	useContext(context: Record<string, any>, mode: ContextMode = ContextMode.add) {
		if (mode === ContextMode.replace) {
			this.#context.clear();
		}
		Object.entries(context).forEach(([key, value]) => this.#context.set(key, value));
	}

	getContext(key: string) {
		return this.#context.get(key);
	}
}

export class Then {
	constructor(private result: any) { }

	should(expected: any) {
		expect(this.result).toBe(expected);
	}

	must(expected: any) {
		expect(this.result).toStrictEqual(expected);
	}

	expected(expected: any) {
		expect(this.result).toEqual(expected);
	}

	is(expected: any) {
		expect(this.result).toBe(expected);
	}

	equals(expected: any) {
		this.is(expected);
	}

	contain(expected: any) {
		expect(this.result).toContain(expected);
	}
}

export class Scenario extends UseContext{
	#givens: Array<Function> = [];
	#whens: Array<Function> = [];
	#thens: Array<Function> = [];
	#name: string;

	constructor(name: string) {
		super()
		this.#name = name;
	}

	given(given: Function) {
		this.#givens.push(given);
		return this;
	}

	when(when: Function) {
		this.#whens.push(when);
		return this;
	}

	then(then: (result: Then) => void) {
		this.#thens.push(then);
		return this;
	}

	run() {
		test(this.#name, () => {
			
		});
	}
}

export class Feature extends UseContext{
	#scenarios = new Map<string, Scenario>();
	#name: string;

	constructor(name: string) {
		super()
		this.#name = name;
	}

	scenario(name: string) {
		const scenario = new Scenario(name);
		this.#scenarios.set(name, scenario);
		return scenario;
	}

	run() {
		describe(this.#name, () => {
			this.#scenarios.forEach((scenario) => scenario.run());
		});
	}
}

const TESTS = new Map<string, Feature>();

export function feature(name: string) {
	if (!TESTS.has(name)) {
		const newFeature = new Feature(name);
		TESTS.set(name, newFeature);
	}
	return TESTS.get(name)!;
}

// Auto-exécution des features après chargement
process.nextTick(() => {
	TESTS.forEach((feat) => feat.run());
});