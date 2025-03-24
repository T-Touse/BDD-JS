import { expectCondition, expectEvery } from "./expect";

export function mockFnTest<T extends (...args: any[]) => any>(
	original: T | object,
	goal: any
): void {
	if (typeof original === "object" && original !== null) {
		// Cas où `original` est un objet : comparer ses entrées avec `goal`
		const originalEntries = Object.entries(original);
		const goalEntries = Object.entries(goal);
		expectEvery(goalEntries, ([key, value]) => originalEntries.some(([k, v]) => k === key && v === value));
	} else {
		// Cas où `original` est une fonction
		if (typeof goal === "object") {
			let entries: [any, any][];

			if (Array.isArray(goal)) {
				entries = goal.map((value, index) => [index, value]);
			} else if (goal instanceof Map) {
				entries = Array.from(goal.entries());
			} else {
				entries = Object.entries(goal);
			}

			if (entries) {
				expectEvery(entries, ([key, value]) => (original as T)(key) === value);
			}
		} else if (typeof goal !== "function") {
			expectCondition((original as T)() === goal);
		}
	}
}

function compareArray(arr1, arr2) {
	if (arr1.length !== arr2.length) return false;
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}
	return true;
}

function mockFnFromEntries(entries) {
	return (...args) => {
		const entry = entries.find(([values]) => compareArray(values, args));
		if (entry) {
			return entry[1];
		}
		throw new Error(`No matching entry for arguments: ${JSON.stringify(args)}`);
	};
}
function mockFnFromObject(object) {
	if (Array.isArray(object)) {
		return mockFnFromEntries(object)
	} else if (object instanceof Map) {
		return mockFnFromEntries(object.entries())
	} else {
		return mockFnFromEntries(Object.entries(object))
	}
}

class Mock {
	#isOriginal = false;
	#handle;

	get isOriginal() {
		return this.#isOriginal;
	}

	constructor(original, template) {
		if (typeof original === "function") {
			mockFnTest(original, template);
			this.#handle = original;
			this.#isOriginal = true;
		} else {
			if (typeof template === "function")
				this.#handle = template;
			else if (typeof template === "object")
				this.#handle = mockFnFromObject(template);
			else
				this.#handle = _ => template;
		}

		if (typeof this.#handle !== "function") {
			throw new TypeError("Le handle doit être une fonction");
		}
	}

	run(...args) {
		return this.#handle(...args);
	}
}

function mock(original, template) {
	if (typeof original === "object" && original !== null) {
		mockFnTest(original, template);
		return new Proxy(original, {
			get: (target, prop) => (prop in template ? template[prop] : target[prop])
		});
	} else {
		return new Mock(original, template);
	}
}

module.exports = { mock, Mock };
