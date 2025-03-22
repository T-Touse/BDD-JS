// TestSuite.js
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
		const report = new Report(this.name);

		this.tests.forEach(({ name, testFn }) => {
			const _ctx = Object.assign({}, ctx);
			this.setupFn(_ctx);

			try {
				const result = testFn(_ctx);
				report.test(name, result);
			} catch (error) {
				report.test(name, error);
			}
		});

		return report.generate();
	}
}

const STATUSCOLORS = {
	PASSED: "\x1b[1;32m", // Green bold
	FAILED: "\x1b[1;31m", // Red bold
	ERROR: "\x1b[1;35m"   // Red bold
};

const STATUSICONS = {
	PASSED: "\u2714", // checkmark
	FAILED: "\u2718", // cross
	ERROR: "\u2BC5" // triangle
};

class Report {
	#reports = [];
	#name;

	constructor(name) {
		this.#name = name;
	}

	test(name, result) {
		const status = typeof result === "object" && result.message ? "ERROR" : result ? "PASSED" : "FAILED";
		const message = status === "ERROR" ? result.message : "";
		this.#reports.push({ name, status, message });
	}

	generate() {
		const log = [];
		console.log(this.#formatTitle(this.#name));
		log.push(this.#name);
		this.#reports.forEach(({ name, status, message }) => {
			console.log(this.#formatTest(name, status, message));
			log.push(`\t${STATUSICONS[status]}  -  ${name} ${status} ${message?`: ${message}`:""}`);
		});
		return log.join('\n');
	}

	#formatTitle(title) {
		return `\x1b[1;36m${title}\x1b[0m`; // Cyan bold
	}

	#formatTest(name, status, message) {
		const statusIcon = `\x1b[4m${STATUSCOLORS[status]}${STATUSICONS[status]}\x1b[0m`; // Underline and color
		const statusText = `\x1b[4m${STATUSCOLORS[status]}${status}\x1b[0m`; // Underline and color
		const messageText = message ? `: ${message}` : "";

		return `\t${statusIcon}  -  ${this.#formatName(name)} ${statusText} ${messageText}`;
	}

	#formatName(name) {
		return `\x1b[1;33m${name}\x1b[0m`; // Yellow bold
	}
}

module.exports = {
	STATUSCOLORS,
	STATUSICONS,
	Report,
	TestSuite,
	test(name) { return new TestSuite(name) },
};