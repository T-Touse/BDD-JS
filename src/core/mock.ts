function _test(path,value,expected){
	if(value != expected){
		console.log(`${path.join('>')} received ${value} expected:${expected}`)
		return false
	}
	return true
}

function expectEvery(goalEntries,tester,name){
	let result = true;
	for(const entry of goalEntries){
		const key = `key : ${entry[0]} \t\t value : ${entry[1]}`
		result &&= _test([name,key],tester(...entry[0]),entry[1])
	}
	return result;
}
function expectCondition(value,name){
	return _test([name],value,true)
}

export function mockFnTest<T extends (...args: any[]) => any>(
	original: T | object,
	goal: any, name:string
): boolean {
		if (typeof original === "object" && original !== null) {
			// Cas où `original` est un objet : comparer ses entrées avec `goal`
			const goalEntries = Object.entries(goal);
			return expectEvery(goalEntries, ([key, value]) => original[key],name);
		} else {
			// Cas où `original` est une fonction
			if (typeof goal === "object") {
				let entries: [any, any][];

				if (Array.isArray(goal)) {
					entries = goal;
				} else if (goal instanceof Map) {
					entries = Array.from(goal.entries());
				} else {
					entries = Object.entries(goal);
				}
				if (entries) {
					return expectEvery(entries, (a,b) => (original as T)(a,b),original.name||name);
				}
			} else if (typeof goal !== "function") {
				return expectCondition((original as T)() === goal,original.name||name);
			}
		}
		return false
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

export class Mock {
	#isOriginal = false;
	#isExpected = true;
	get isOriginal() {
		return this.#isOriginal;
	}
	get isExpected() {
		return this.#isExpected;
	}
	constructor(isOriginal,isExpected){
		this.#isOriginal = isOriginal
		this.#isExpected = isExpected
	}
}
export class MockObj extends Mock {
	#value
	get object(){
		return this.#value
	}
	constructor(original, template = {},name:string){
		let isExpected = mockFnTest(original, template,name);
		let isOriginal = original!=null
		if(!isOriginal)
			original = {}
		super(isOriginal,isExpected)
		this.#value = new Proxy(original, {
			get: (target, prop) => (prop in template ? template[prop] : target[prop])
		});
		if (typeof this.#value !== "object") {
			throw new TypeError("Le handle doit être une fonction");
		}
	}
}
export class MockFn extends Mock {
	#handle;
	constructor(original, template,name:string) {
		let handle
		let isOriginal = false
		let isExpected = false
		if (typeof original === "function") {
			isExpected = mockFnTest(original, template,name);
			handle = original;
			isOriginal = true;
		} else {
			if (typeof template === "function")
				handle = template;
			else if (typeof template === "object")
				handle = mockFnFromObject(template);
			else
				handle = _ => template;
		}
		super(isOriginal,isExpected)
		this.#handle = handle
		if (typeof this.#handle !== "function") {
			throw new TypeError("Le handle doit être une fonction");
		}
	}

	run(...args) {
		return this.#handle(...args);
	}
}

export function mock(original, template,name) {
	if(!name)
		name = original?.name||template?.name||crypto.randomUUID();
	if (typeof original === "object") {
		return new MockObj(original, template,name);
	} else {
		return new MockFn(original, template,name);
	}
}