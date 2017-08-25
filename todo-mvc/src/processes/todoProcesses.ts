import { find, findIndex } from '@dojo/shim/array';
import { add, replace, remove } from './../store/operation';
import { createClient } from 'service-mocker/client';
import {
	CommandResponse,
	CommandRequest,
	createSuccessCommandResponse,
	createFailureCommandResponse
} from './../store/store';

const scriptURL = require('sw-loader!../util/server');

const { ready } = createClient(scriptURL);

function byId(id: string) {
	return (todo: any) => id === todo.id;
}

function throwIfNotOk(response: Response) {
	if (!response.ok) {
		throw new Error();
	}
	return response;
}

function byCompleted(completed: boolean) {
	return (todo: any) => completed === todo.completed;
}

function updateTodoOperationFactory(get: any, payload: any) {
	const todos = get('/todos');
	const todo = find(todos, byId(payload.id));
	const index = todos.indexOf(todo);
	return replace(`/todos/${index}`, { ...todo, ...payload });
}

function addTodoCommand({ get, payload }: CommandRequest): CommandResponse {
	const todos = get('/todos');
	return createSuccessCommandResponse(add(`/todos/${todos.length}`, payload));
}

function calculateCountsCommand({ get }: CommandRequest): CommandResponse {
	const todos = get('/todos');
	const completedTodos = todos.filter((todo: any) => todo.completed);
	return createSuccessCommandResponse([
		replace('/activeCount', todos.length - completedTodos.length),
		replace('/completedCount', completedTodos.length)
	]);
}

function toggleAllTodosCommand({ get }: CommandRequest): CommandResponse {
	const todos = get('/todos');
	const shouldComplete = !!find(todos, byCompleted(false));
	const updatedTodos = todos.map((todo: any) => {
		return { ...todo, completed: shouldComplete };
	});
	return createSuccessCommandResponse(replace('/todos', updatedTodos));
}

function clearCompletedCommand({ get }: CommandRequest): CommandResponse {
	const todos = get('/todos');
	const activeTodos = todos.filter(byCompleted(false));
	return createSuccessCommandResponse(replace('/todos', activeTodos));
}

function todoInputCommand({ payload }: CommandRequest): CommandResponse {
	return createSuccessCommandResponse(replace('/currentTodo', payload));
}

function toggleTodoCommand({ get, payload: [ id, completed ] }: CommandRequest): CommandResponse {
	return createSuccessCommandResponse(updateTodoOperationFactory(get, { id, completed: !completed }));
}

function editTodoCommand({ get, payload: [ id ] }: CommandRequest): CommandResponse {
	return createSuccessCommandResponse(updateTodoOperationFactory(get, { id, editing: true }));
}

function saveTodoCommand({ get, payload: [ id, label ] }: CommandRequest): CommandResponse {
	const todo: any = { id, editing: false };
	if (label) {
		todo.label = label;
	}
	return createSuccessCommandResponse(updateTodoOperationFactory(get, todo));
}

function clearFailedCommand(): CommandResponse {
	return createSuccessCommandResponse(replace('/failed', false));
}

function postTodoCommand({ get, payload }: CommandRequest): Promise<CommandResponse> {
	const fetchOptions = {
		body: JSON.stringify(payload),
		method: 'POST',
		headers: { 'Content-Type': 'application/json' }
	};
	return ready
		.then(() => fetch('/todo', fetchOptions))
		.then(throwIfNotOk)
		.then((response: Response) => response.json())
		.then((data: any) => {
			const todos =  get('/todos');
			const index = findIndex(todos, byId(payload.id));
			return createSuccessCommandResponse(replace(`/todos/${index}`, { ...todos[index], loading: false, id: data.uuid }));
		}, () => {
			return createFailureCommandResponse(add('/failed', true));
		});
}

function getTodosCommand(): Promise<CommandResponse> {
	return ready
		.then(() => fetch('/todos'))
		.then((response: Response) => response.json())
		.then((data: any) => {
			return data.map(({ uuid, label, completed }: any) => {
				return { id: uuid, label, completed };
			});
		})
		.then((todos: any) => {
			return createSuccessCommandResponse(replace(`/todos`, todos));
		});
}

function deleteTodoCommand({ get, payload: [ id ] }: CommandRequest): Promise<CommandResponse> {
	const fetchOptions = {
		method: 'DELETE',
		headers: { 'Content-Type': 'text/plain' }
	};
	return ready
		.then(() => find(get('/todos'), byId(id)))
		.then((todo: any) => fetch(`/todo/${todo.id}`, fetchOptions))
		.then(throwIfNotOk)
		.then(() => {
			const index = findIndex(get('/todos'), byId(id));
			return createSuccessCommandResponse(remove(`/todos/${index}`));
		}, () => {
			return createFailureCommandResponse(add('/failed', true));
		});
}

export const clearFailedProcess = [ clearFailedCommand ];
export const deleteTodoProcess = [ deleteTodoCommand, calculateCountsCommand ];
export const getTodosProcess = [ getTodosCommand, calculateCountsCommand ];
export const addTodoProcess = [ addTodoCommand, calculateCountsCommand ];
export const addTodoProcessWithPost = [ ...addTodoProcess, postTodoCommand, calculateCountsCommand ];
export const toggleTodoProcess = [ toggleTodoCommand, calculateCountsCommand ];
export const updateTodoProcess = [ saveTodoCommand ];
export const todoInputProcess = [ todoInputCommand ];
export const editTodoProcess = [ editTodoCommand ];
export const saveTodoProcess = [ saveTodoCommand ];
export const toggleAllTodoProcess = [ toggleAllTodosCommand, calculateCountsCommand ];
export const clearCompletedProcess = [ clearCompletedCommand, calculateCountsCommand ];
