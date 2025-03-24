const { describe, test, expect,mock } = require('../../index');

describe("definied mock",()=>{
	const mock_def = mock(_=>"Objectif",_=>"Template")
	test("is original",()=>{
		expect(mock_def.isOriginal).toBeTrue()
	})
	test("running",()=>{
		expect(mock_def.run()).toContain("Objectif")
	})
})
describe("undefinied mock",()=>{
	const mock_undef = mock(undefined,_=>"Template")
	test("is original",()=>{
		expect(mock_undef.isOriginal).toBeFalse()
	})
	test("running",()=>{
		expect(mock_undef.run()).toContain("Template")
	})
})

describe("object mock",()=>{
	const mock_obj = mock({value:1},{value:1})
	test("is original",()=>{
		expect(mock_obj.isOriginal).toBeTrue()
	})
	test("running",()=>{
		expect(mock_obj.object.value).toEqual(1)
	})
})

describe("undefined addition mock",()=>{
	const mock_add_true = mock(undefined,[
		[[2,3],5],
		[[4,3],7],
	])
	test("is original",()=>{
		expect(mock_add_true.isOriginal).toBeFalse()
	})
	test("running",()=>{
		expect(mock_add_true.run(2,3)).toEqual(5)
	})
})
describe("true addition mock",()=>{
	const mock_add_true = mock((a,b)=>a+b,[
		[[2,3],5],
		[[4,3],7],
	])
	test("is expected",()=>{
		expect(mock_add_true.isExpected).toBeTrue()
	})
	test("is original",()=>{
		expect(mock_add_true.isOriginal).toBeTrue()
	})
	test("running",()=>{
		expect(mock_add_true.run(5,5)).toEqual(10)
	})
})
describe("false addition mock",()=>{
	const mock_add_false = mock((a,b)=>a*b,[
		[[2,3],5],
		[[4,3],7],
	])
	test("is expected",()=>{
		expect(mock_add_false.isExpected).toBeFalse()
	})
	test("is original",()=>{
		expect(mock_add_false.isOriginal).toBeTrue()
	})
	test("running",()=>{
		expect(mock_add_false.run(5,5)).not.toEqual(10)
	})
})