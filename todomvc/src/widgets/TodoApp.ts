import Map from '@dojo/shim/Map';
import uuid from '@dojo/core/uuid';
import { assign } from '@dojo/core/lang';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, theme } from '@dojo/widget-core/mixins/Themeable';
import { w, v } from '@dojo/widget-core/d';
import { registry } from '@dojo/widget-core/d';

import TodoHeader from './TodoHeader';
import TodoList from './TodoList';
import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';
import TodoFilter from './TodoFilter';

import * as css from './styles/todoApp.css';

registry.define('todo-header', TodoHeader);
registry.define('todo-list', TodoList);
registry.define('todo-item', TodoItem);
registry.define('todo-footer', TodoFooter);
registry.define('todo-filter', TodoFilter);

export interface Todo {
	label: string;
	completed: boolean;
	editing?: boolean;
}

export const TodoAppBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class TodoApp extends TodoAppBase<WidgetProperties> {

	private todos: Map<string, Todo> = new Map<string, Todo>();
	private completedCount: number = 0;
	private activeFilter: string = 'all';

	addTodo(todo: Todo, id: string = uuid()) {
		this.todos.set(id, todo);
		this.onUpdate();
	}

	removeTodo(id: string) {
		const todo = this.todos.get(id);
		if (todo) {
			this.todos.delete(id);
			this.completedCount = todo.completed ? --this.completedCount : this.completedCount;
			this.onUpdate();
		}
	}

	toggleTodo(id: string) {
		const todo = this.todos.get(id);
		if (todo) {
			const completed = !todo.completed;
			this.completedCount = completed ? ++this.completedCount : --this.completedCount;
			this.todos.set(id, assign(<any> {}, todo, { completed }));
			this.onUpdate();
		}
	}

	toggleAllTodos() {
		const completed = this.completedCount !== this.todos.size;
		this.todos.forEach((todo, key) => {
			this.todos.set(key, assign(<any> {}, todo, { completed }));
		});
		this.completedCount = completed ? this.todos.size : 0;
		this.onUpdate();
	}

	editTodo(id: string) {
		const todo = this.todos.get(id);
		if (todo) {
			this.todos.set(id, assign(<any> {}, todo, { editing: true }));
			this.onUpdate();
		}
	}

	updateTodo(id: string, label: string) {
		const existingTodo = this.todos.get(id);
		if (existingTodo) {
			this.todos.set(id, assign(<any> {}, existingTodo, { label, editing: false }));
			this.onUpdate();
		}
	}

	clearCompleted() {
		this.todos.forEach((todo, key) => {
			if (todo.completed) {
				this.todos.delete(key);
			}
		});
		this.completedCount = 0;
		this.onUpdate();
	}

	render() {
		const { activeFilter, todos, completedCount } = this;
		const allCompleted = todos.size !== 0 && completedCount === todos.size;
		const activeCount = todos.size - completedCount;

		return v('section', { classes: this.classes(css.todoapp) }, [
			v('button', { type: 'button', onclick: (<any> this.properties).stress, styles: { height: '70px', width: '150px', 'background-color': 'red', 'float': 'right' }, innerHTML: 'stress' }),
			w('todo-header', { allCompleted, addTodo: this.addTodo, toggleAllTodos: this.toggleAllTodos }),
			v('section', {}, [
				w('todo-list', { activeFilter, todos, editTodo: this.editTodo, removeTodo: this.removeTodo, toggleTodo: this.toggleTodo, updateTodo: this.updateTodo })
			]),
			todos.size ? w('todo-footer', { activeFilter, clearCompleted: this.clearCompleted, allCompleted, activeCount }) : null
		]);
	}

	private onUpdate() {
		this.todos = new Map<string, Todo>(this.todos.entries());
		this.invalidate();
	}
}
