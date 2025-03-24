const { describe, test, expect } = require('bun:test');
const { mock } = require('../src/mocks');

const print = mock(_=>"Objectif",_=>"Template")
const un_print = mock(undefined,_=>"Template")

describe("definied mock",()=>{
	test("is original",()=>{
		expect(print.isOriginal).toBeTrue()
	})
	test("running",()=>{
		expect(print.run()).toContain("Objectif")
	})
})

describe("undefinied mock",()=>{
	test("is original",()=>{
		expect(un_print.isOriginal).toBeFalse()
	})
	test("running",()=>{
		expect(un_print.run()).toContain("Template")
	})
})