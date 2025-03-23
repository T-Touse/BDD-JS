const { describe, test, expect } = require('bun:test');
const { Report } = require('../src/reports');

describe('Report', () => {
	test('should generate a report with a title', () => {
		const report = new Report('Mon Test Suite');
		expect(report.toString()).toContain('Mon Test Suite');
	});

	test('should add a test with PASSED status', () => {
		const report = Report.from('passed test',[{name:'Test 1',result:true}]);
		expect(report.toString()).toContain('PASSED');
	});

	test('should add a test with FAILED status', () => {
		const report = Report.from('falied test',[{name:'Test 1',result:false}]);
		expect(report.toString()).toContain('FAILED');
	});

	test('should add a test with ERROR status', () => {
		const report = Report.from('error test',[{name:'Test 1',result:new Error('Erreur simulée')}]);
		expect(report.toString()).toContain('ERROR : Erreur simulée');
	});

	test('should handle multiple tests', () => {
		const report = Report.from('multi test report',[
			{name:'Test 1',result:true},{name:'Test 2',result:false},
			{name:'Test 3',result:new Error('Erreur simulée')}
		]);
		const generatedReport = report.toString();
		expect(generatedReport).toContain('Test 1 PASSED');
		expect(generatedReport).toContain('Test 2 FAILED');
		expect(generatedReport).toContain('Test 3 ERROR : Erreur simulée');
	});
});