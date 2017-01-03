import todoStore, { Item } from '../stores/todoStore';
import { assign } from 'dojo-core/lang';

let id = 0;

export const addTodo = function({ label, completed }: { label: string, completed: boolean }) {
	return todoStore.add({ id: `${id++}`, label, completed });
};

export const deleteTodo = function({ id }: { id: string }) {
	return todoStore.delete(id);
};

export const deleteCompleted = function() {
	const completedItems = todoStore.query((item: Item) => {
		return Boolean(item.completed);
	});
	const ids = completedItems.map((item) => item.id);

	todoStore.delete(ids);
};

export const toggleAll = function({ checked: completed }: { checked: boolean }) {
	let todos = todoStore.fetch();

	if (todos && Array.isArray(todos)) {
		todos = todos.map((todo) => assign({}, todo, <any> { completed }));
		todoStore.patch(todos);
	}
};

export const updateTodo = function(item: Item) {
	return todoStore.patch(item);
};
