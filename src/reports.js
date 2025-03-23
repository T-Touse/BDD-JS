import { Logger } from "../src/logger";

const STATUSCOLORS = {
	PASSED: "\x1b[1;32m", // Green bold
	FAILED: "\x1b[1;31m", // Red bold
	ERROR: "\x1b[1;35m"   // Magenta bold
};

const STATUSICONS = {
	PASSED: "\u2714", // Checkmark
	FAILED: "\u2718", // Cross
	ERROR: "\u2BC5" // Triangle
};

class Report {
	#reports = [];
	#name;

	constructor(name) {
		this.#name = name;
	}
	static from(name,tests = []){
		const report = new Report(name)
		tests.forEach(({name,result})=>{
			const status = typeof result === "object" && result.message ? "ERROR" : result ? "PASSED" : "FAILED";
			const message = status === "ERROR" ? result.message : "";
			const timestamp = new Date().toISOString();
			report.#reports.push({ name, status, message, timestamp });
		})
		return report
	}

	generate() {
		const report = {
			name: this.#name,
			timestamp: new Date().toISOString(),
			tests: this.#reports
		};
		this.#printReport(report);
		return report;
	}
	toString(){
		const report = [this.#name]
		this.#reports.forEach(({ name, status, message }) => {
			report.push(`\t${STATUSICONS[status]}  -  ${name} ${status} ${message?`: ${message}`:""}`);
		});
		return report.join('')
	}

	#printReport(report) {
		Logger.log(this.#formatTitle(report.name));
		report.tests.forEach(({ name, status, message }) => {
			Logger.log(this.#formatTest(name, status, message));
		});
	}

	#formatTitle(title) {
		return `\x1b[1;36m${title}\x1b[0m`; // Cyan bold
	}

	#formatTest(name, status, message) {
		const statusIcon = `${STATUSCOLORS[status]}${STATUSICONS[status]}\x1b[0m`;
		const statusText = `${STATUSCOLORS[status]}${status}\x1b[0m`;
		const messageText = message ? `: ${message}` : "";

		return `\t${statusIcon}  -  ${this.#formatName(name)} ${statusText} ${messageText}`;
	}

	#formatName(name) {
		return `\x1b[1;33m${name}\x1b[0m`; // Yellow bold
	}
}

export { Report, STATUSCOLORS, STATUSICONS };
