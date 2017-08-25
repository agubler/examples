import { RemovePatchOperation, ReplacePatchOperation, AddPatchOperation, TestPatchOperation, OperationType } from './patch/StatePatch';
import { StatePointer } from './patch/StatePointer';

export function add(path: string, value: any): AddPatchOperation {
	return {
		op: OperationType.ADD,
		path: new StatePointer(path),
		value
	};
}

export function replace(path: string, value: any): ReplacePatchOperation {
	return {
		op: OperationType.REPLACE,
		path: new StatePointer(path),
		value
	};
}

export function remove(path: string): RemovePatchOperation {
	return {
		op: OperationType.REMOVE,
		path: new StatePointer(path)
	};
}

export function test(path: string, value: any): TestPatchOperation {
	return {
		op: OperationType.TEST,
		path: new StatePointer(path),
		value
	};
}
