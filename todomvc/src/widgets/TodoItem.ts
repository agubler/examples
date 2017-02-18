import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { Todo } from './TodoApp';

import * as css from './styles/todoItem.css';

export interface TodoItemProperties extends WidgetProperties {
	todo: Todo;
	editing: boolean;
	editTodo: Function;
	toggleTodo: Function;
	removeTodo: Function;
	updateTodo: Function;
}

export const TodoItemBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class TodoItem extends TodoItemBase<TodoItemProperties> {

	toggleTodo() {
		this.properties.toggleTodo(this.properties.key);
	}

	editTodo() {
		this.properties.editTodo(this.properties.key);
	}

	updateTodo({ which, target: { value } }: any) {
		if (which === 13 || !which) {
			if (value) {
				this.properties.updateTodo(this.properties.key, value);
			}
			else {
				this.removeTodo();
			}
		}
	}

	removeTodo() {
		this.properties.removeTodo(this.properties.key);
	}

	afterCreate(element: HTMLInputElement) {
		setTimeout(() => element.focus(), 0);
	}

	render() {
		const { properties: { todo } } = this;

		return v('li', { id: 'todo-item', classes: this.classes(css.todoItem, todo.editing ? css.editing : null, todo.completed && !todo.editing ? css.completed : null) }, [
			v('div', { classes: this.classes(css.view) }, [
				v('input', { id: 'toggle', classes: this.classes(css.toggle), type: 'checkbox', checked: todo.completed, onchange: this.toggleTodo }),
				v('label', { classes: this.classes(css.todoLabel), innerHTML: todo.label, ondblclick: this.editTodo }),
				v('button', { id: 'destroy', onclick: this.removeTodo, classes: this.classes(css.destroy) })
			]),
			todo.editing ? v('input', { afterCreate: this.afterCreate, onkeyup: this.updateTodo, onblur: this.updateTodo, value: todo.label, classes: this.classes(css.edit) }) : null
		]);
	}
}
