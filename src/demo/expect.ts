let { expect } = require("bun:test");

// Vérifie si une condition est vraie (équivalent à `expect`)
export function expectCondition(condition: boolean, message?: string): void {
	expect(condition).toBe()
}

// Vérifie que toutes les conditions d'une liste sont vraies
export function expectEvery<T>(
	items: T[],
	condition: (item: T) => boolean,
	message?: string
): void {
	for (const item of items) {
		if (!condition(item)) {
			throw new Error(message || `Expectation failed for item: ${JSON.stringify(item)}`);
		}
	}
}