import { assign } from 'dojo-core/lang';
import widgetStore from '../stores/widgetStore';
import { addTodo, deleteCompleted, deleteTodo, toggleAll, updateTodo } from './todoStoreActions';
import { TodoItemState } from '../widgets/TodoItem';

interface FormEvent extends Event {
	target: HTMLInputElement;
}

interface FormInputEvent extends KeyboardEvent {
	target: HTMLInputElement;
}

export const todoInput = function({ which, target: { value: label } }: FormInputEvent) {
	if (which === 13 && label) {
		addTodo({ label, completed: false });
		widgetStore.patch({ id: 'todo-app', todo: '' });
	}
	else {
		widgetStore.patch({ id: 'todo-app', todo: label });
	}
};

function toggleEditing(todos: TodoItemState[], todoId: string, editing: boolean): TodoItemState[] {
	return todos
		.filter((todo) => todo.id === todoId)
		.map((todo) => {
			todo.editing = true;
			return todo;
		});
}

export const todoEdit = function(this: any, event: KeyboardEvent) {
	const { state: { todoItemId: id } } = this;
	if (event.type === 'keypress' && event.which !== 13 && event.which !== 32) {
		return;
	}
	const todoListState = widgetStore.get('todo-app');
	const { todos } = todoListState;
	todoListState.todos = toggleEditing(todos, id, true);
	widgetStore.patch(todoListState);
};

export const todoEditInput = function(this: any, event: FormInputEvent) {
	const { state } = this;
	if (event.which === 13) {
		todoSave.call(this, event);
	}
	else if (event.which === 27) {
		const todoListState = widgetStore.get('todo-app');
		todoListState.todos = toggleEditing(todoListState.todos, state.id, false);
		widgetStore.patch({ id: 'todo-app', todoListState });
	}
};

export const todoSave = function(this: any, event: FormInputEvent) {
	const { state } = this;
	if (!event.target.value) {
		deleteTodo({ id: state.todoItemId });
	}
	else {
		updateTodo(assign({}, state, { id: state.todoItemId, label: event.target.value, editing: false }));
	}
};

export const todoRemove = function(this: any) {
	const { state: { todoItemId: id } } = this;
	deleteTodo({ id });
};

export const todoToggleComplete = function(this: any) {
	const { state } = this;
	updateTodo({ id: state.todoItemId, completed: !state.checked });
};

export const filter = function(this: any, { filter }: { filter: 'active' | 'all' | 'completed' }) {
	const { state: { activeFilter = filter } = { } } = this;
	widgetStore.patch({ id: 'todo-app', activeFilter });
};

export const todoToggleAll = function(event: FormEvent) {
	toggleAll({ checked: event.target.checked });
};

export const clearCompleted = function() {
	deleteCompleted();
};
