import { describe, DescriptorTypes } from "./description";

function testRunner(callback: Function): Function {
	return async () => {
		callback()
		return DescriptorTypes.TEST;
	}
}

export function test(name: string, callback: Function) {
	describe(name, testRunner(callback));
}

test.only = (name: string, callback: Function) => {
	describe.only(name, testRunner(callback));
};

test.skip = (name: string, callback: Function) => {
	describe.skip(name, testRunner(callback));
};

test.todo = (name: string, callback: Function) => {
	describe.todo(name, testRunner(callback));
};
test.skipIf = function (condition: boolean) {
	return (name: string, callback: Function) =>
		describe.skipIf(condition)(name, testRunner(callback));
}
test.todoIf = function (condition: boolean) {
	return (name: string, callback: Function) =>
		describe.todoIf(condition)(name, testRunner(callback));
}
test.if = function (condition: boolean) {
	return (name: string, callback: Function) =>
		describe.if(condition)(name, testRunner(callback));
}
test.each = <T>(list: T[]) => {
	return (name: string, callback: Function) => {
		describe.each(list)(name, testRunner(callback));
	};
};