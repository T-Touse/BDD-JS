type TestFn = () => void | Promise<void>;

const TESTS: Array<{ name: string; fn: TestFn }> = [];
let CURRENT_CONTEXT: string | null = null;

/**
 * Déclare un groupe de tests.
 */
export function describe(name: string, callback: () => void): void {
	const previousContext = CURRENT_CONTEXT;
	CURRENT_CONTEXT = previousContext ? `${previousContext} > ${name}` : name;
	callback();
	CURRENT_CONTEXT = previousContext; // Restaure le contexte après exécution
}

/**
 * Déclare un test.
 */
export function test(name: string, fn: TestFn): void {
	TESTS.push({ name: CURRENT_CONTEXT ? `${CURRENT_CONTEXT} > ${name}` : name, fn });
}

/**
 * Exécute tous les tests enregistrés.
 */
async function runTests() {
	for (const { name, fn } of TESTS) {
		try {
			await fn();
			console.log(`✅ ${name}`);
		} catch (error) {
			
			console.error(`❌ ${name} [${error.name??""}]`);
			//console.error(error);
		}
	}
}

// Lancement automatique des tests après la fin du script principal
process.nextTick(runTests);
