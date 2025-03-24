import { describe,test,expect } from "bun:test";

export class Feature{
	#scenarios = new Map<String,Function>
	#describe
	#name
	constructor(name){
		this.#describe = describe(name,()=>{
			this.#scenarios.forEach((scenario,name)=>{
				test(name,scenario)
			})
		})
	}
	scenario(){

	}
}

const TESTS = new Map<String,Feature>()

export function feature(name){
	if(TESTS.has(name)){
		return TESTS.get(name)
	}
	const feature = new Feature(name)
	TESTS.set(name,feature)
	return feature
}