// test.test.js
const { describe, test, expect } = require('bun:test');
const { TestSuite, Report } = require('../src/test');

describe('TestSuite', () => {
	test('should run a test and report PASSED', () => {
		const suite = new TestSuite('Test Suite 1');
		suite.test('Test 1', () => true);
		const report = suite.run();
		expect(report).toContain('Test 1 PASSED');
	});

	test('should run a test and report FAILED', () => {
		const suite = new TestSuite('Test Suite 2');
		suite.test('Test 1', () => false);
		const report = suite.run();
		expect(report).toContain('Test 1 FAILED');
	});

	test('should run a test and report ERROR', () => {
		const suite = new TestSuite('Test Suite 3');
		suite.test('Test 1', () => { throw new Error('Erreur simulée'); });
		const report = suite.run();
		expect(report).toContain('Test 1 ERROR : Erreur simulée');
	});

	test('should run multiple tests', () => {
		const suite = new TestSuite('Test Suite 4');
		suite.test('Test 1', () => true);
		suite.test('Test 2', () => false);
		suite.test('Test 3', () => { throw new Error('Erreur simulée'); });
		const report = suite.run();
		expect(report).toContain('Test 1 PASSED');
		expect(report).toContain('Test 2 FAILED');
		expect(report).toContain('Test 3 ERROR : Erreur simulée');
	});

	test('should run tests with setup', () => {
		const suite = new TestSuite('Test Suite 5');
		suite.setup(ctx => {
			ctx.value = 10;
		});
		suite.test('Test 1', ctx => ctx.value === 10);
		suite.test('Test 2', ctx => ctx.value === 20);
		suite.test('Test 3', ctx => { throw new Error('Erreur simulée'); });
		const report = suite.run();
		expect(report).toContain('Test 1 PASSED');
		expect(report).toContain('Test 2 FAILED');
		expect(report).toContain('Test 3 ERROR : Erreur simulée');
	});
});

describe('Report', () => {
	test('should generate a report with a title', () => {
		const report = new Report('Mon Test Suite');
		expect(report.generate()).toContain('Mon Test Suite');
	});

	test('should add a test with PASSED status', () => {
		const report = new Report('Mon Test Suite');
		report.test('Test 1', true);
		expect(report.generate()).toContain('Test 1 PASSED');
	});

	test('should add a test with FAILED status', () => {
		const report = new Report('Mon Test Suite');
		report.test('Test 1', false);
		expect(report.generate()).toContain('Test 1 FAILED');
	});

	test('should add a test with ERROR status', () => {
		const report = new Report('Mon Test Suite');
		report.test('Test 1', new Error('Erreur simulée'));
		expect(report.generate()).toContain('Test 1 ERROR : Erreur simulée');
	});

	test('should handle multiple tests', () => {
		const report = new Report('Mon Test Suite');
		report.test('Test 1', true);
		report.test('Test 2', false);
		report.test('Test 3', new Error('Erreur simulée'));
		const generatedReport = report.generate();
		expect(generatedReport).toContain('Test 1 PASSED');
		expect(generatedReport).toContain('Test 2 FAILED');
		expect(generatedReport).toContain('Test 3 ERROR : Erreur simulée');
	});
});