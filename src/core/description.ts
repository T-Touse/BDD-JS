import { format } from "../utils";
import { report, ReportStatus } from "./logging/report";

const FILTERS: string[] = ((): string[] => {
	const tags = process.argv.find(arg => /--tags=(.*\,)*/.test(arg)) ?? ""
	return (tags.slice(tags.indexOf("=") + 1) ?? "").split(',').filter(Boolean) ?? []
})();

export enum DescriptorTypes{
	TEST,GROUP,UNKNOWN
}
interface Descriptor {
	name: string;
	path: string[];
	type:DescriptorTypes;
	children:Descriptor[];
	parent:Descriptor|undefined;
}

const STACK: Descriptor[] = [];

async function runDescriptor(descriptor: Descriptor , callback: Function) {
	const path: string[] = STACK.map(d => d.name);
	descriptor.path = path;
	const parent = descriptor.parent

	let error, result, status;
	try {
		result = await callback();
		status = ReportStatus.PASSED;
	} catch (e) {
		error = e;
		status = ReportStatus.FAILED;
	}

	if(parent){
		if(parent.type == DescriptorTypes.UNKNOWN){
			report(parent.path, ReportStatus.BEFORE);
			parent.type = DescriptorTypes.GROUP;
		}
	}
	if(descriptor.type == DescriptorTypes.UNKNOWN && result in DescriptorTypes)
		descriptor.type = result

	report(path, status, error);

	
}

async function childDescriptor(name: string, callback: Function) {
	const parent = STACK.at(-1);
	const descriptor: Descriptor = { 
		name,
		type:DescriptorTypes.UNKNOWN,
		path:[],
		children:[],parent
	};
	if(parent)
		parent.children.push(descriptor)
	STACK.push(descriptor)
	runDescriptor(descriptor,callback)
	STACK.pop();
}

export function describe(name: string, callback: Function, tags: string[] = []) {
	if (FILTERS.length == 0 || tags.some(tag => FILTERS.includes(tag))) {
		childDescriptor(name, callback)
	}
}
describe.only = function (name: string, callback: Function) {
	describe(name, callback, ["only"]);
}
describe.skip = function (name: string, callback: Function) {
	describe(name, callback, ["skip"]);
}
describe.todo = function (name: string, callback: Function) {
	describe(name, callback, ["todo"]);
}
describe.skipIf = function (condition: boolean) {
	return (name: string, callback: Function) =>
		condition ? describe.skip(name, callback) : null;
}
describe.todoIf = function (condition: boolean) {
	return (name: string, callback: Function) =>
		condition ? describe.todo(name, callback) : null;
}
describe.if = function (condition: boolean) {
	return (name: string, callback: Function) =>
		condition ? describe(name, callback) : null;
}
describe.each = function <T>(list: T[]) {
	return (name: string, callback: Function) => {
		return list.map((x, n) => {
			const arr = Array.isArray(x) ? x : [x];
			const itemName = format(name, arr, n);
			return describe(itemName, () => callback(x, n));
		});
	};
}