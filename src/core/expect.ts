export class Expect {
	#value;

	constructor(value) {
		this.#value = value;
	}

	#assert(condition, message,isNot = false) {
		if (isNot) {
			condition = !condition;
		}
		if (!condition) {
			throw new Error(message);
		}
	}

	toBe(value,isNot) {
		this.#assert(this.#value === value, `Expected ${this.#value} to be ${value}`,isNot);
		return this
	}
	notToBe(value) {return this.toBe(value,true)}
	
	toEqual(value,isNot) {
		this.#assert(JSON.stringify(this.#value) === JSON.stringify(value), `Expected ${this.#value} to equal ${value}`,isNot);
		return this
	}
	notToEqual(value){return this.toEqual(value,true)}

	toBeNull(isNot) {
		this.#assert(this.#value === null, `Expected ${this.#value} to be null`,isNot);
		return this
	}
	notToBeNull(){return this.toBeNull(true)}

	toBeUndefined(isNot?) {
		this.#assert(this.#value === undefined, `Expected ${this.#value} to be undefined`,isNot);
		return this
	}
	notToBeUndefined(){return this.toBeUndefined(true)}
	toBeDefined(){return this.toBeUndefined(true)}
	notToBeDefined(){return this.toBeUndefined()}

	toBeTrue(isNot?) {
		this.#assert(this.#value === true, `Expected ${this.#value} to be true`,isNot);
		return this
	}
	notToBeTrue(){return this.toBeTrue(true)}
	toBeFalse(){return this.toBeTrue(true)}
	notToBeFalse(){return this.toBeTrue()}
	notoEqual(value){return this.toEqual(value,true)}

	toBeGreaterThan(value,isNot) {
		this.#assert(this.#value > value, `Expected ${this.#value} to be greater than ${value}`,isNot);
		return this
	}

	toBeGreaterThanOrEqual(value,isNot) {
		this.#assert(this.#value >= value, `Expected ${this.#value} to be greater than or equal to ${value}`,isNot);
		return this
	}

	toBeLessThan(value,isNot) {
		this.#assert(this.#value < value, `Expected ${this.#value} to be less than ${value}`,isNot);
		return this
	}

	toBeLessThanOrEqual(value,isNot) {
		this.#assert(this.#value <= value, `Expected ${this.#value} to be less than or equal to ${value}`,isNot);
		return this
	}

	toContain(value,isNot) {
		this.#assert(this.#value.includes(value), `Expected ${this.#value} to contain ${value}`,isNot);
		return this
	}

	toMatch(regex,isNot) {
		this.#assert(regex.test(this.#value), `Expected ${this.#value} to match ${regex}`,isNot);
		return this
	}

	toThrow(error,isNot) {
		try {
			this.#value()
			this.#assert(false, `Expected function to throw`);
		} catch (e) {
			this.#assert(true, `Expected function not to throw`);
		}
		return this
	}
	notToThrow(error){
		return this.toThrow(error,true)
	}

}

export function expect(value) {
	return new Expect(value);
}