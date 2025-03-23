const { Report } = require("./reports");

class TestSuite {
	constructor(name) {
		this.name = name;
		this.tests = [];
		this.setupFn = () => { };
	}

	setup(fn) {
		this.setupFn = fn;
		return this;
	}

	test(name, testFn) {
		this.tests.push({ name, testFn });
		return this;
	}

	run(ctx = {}) {
		const tests= this.tests.map(({ name, testFn }) => {
			const _ctx = Object.assign({}, ctx);
			this.setupFn(_ctx);

			try {
				const result = testFn(_ctx);
				return {name, result};
			} catch (error) {
				return {name, result:error};
			}
		});
		return Report.from(this.name,tests);
	}
}

module.exports = {
	TestSuite,
	test(name) { return new TestSuite(name) },
};