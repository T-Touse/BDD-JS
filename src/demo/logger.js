const IS_TEST_ENV = process.env.BUN_TEST || process.env.NODE_ENV?.includes("test");

const COLORS = {
	RESET: "\x1b[0m",
	INFO: "\x1b[34m",   // Bleu
	WARN: "\x1b[33m",   // Jaune
	ERROR: "\x1b[31m",  // Rouge
	DEBUG: "\x1b[36m",   // Cyan
	TEST: "\x1b[35m"   // Magenta
};

class Logger {
	static test(...args) {
		if (IS_TEST_ENV) console.log(`${COLORS.TEST}[TEST]`, ...args, COLORS.RESET);
	}

	static log(...args) {
		if (!IS_TEST_ENV) console.log(`[LOG]`, ...args, COLORS.RESET);
	}

	static info(...args) {
		if (!IS_TEST_ENV) console.log(`${COLORS.INFO}[INFO]`, ...args, COLORS.RESET);
	}

	static warn(...args) {
		if (!IS_TEST_ENV) console.warn(`${COLORS.WARN}[WARN]`, ...args, COLORS.RESET);
	}

	static error(...args) {
		if (!IS_TEST_ENV) console.error(`${COLORS.ERROR}[ERROR]`, ...args, COLORS.RESET);
	}

	static debug(...args) {
		if (!IS_TEST_ENV && process.env.DEBUG) {
			console.log(`${COLORS.DEBUG}[DEBUG]`, ...args, COLORS.RESET);
		}
	}
}

module.exports = {Logger}