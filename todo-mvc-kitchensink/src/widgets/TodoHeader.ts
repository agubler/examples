import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import  { v } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import { I18nMixin } from '@dojo/widget-core/mixins/I18n';

import appBundle from '../nls/common';
import * as css from './styles/todoHeader.m.css';

export interface TodoHeaderProperties {
	allCompleted: boolean;
	todo: string;
	todoCount: number;
	toggleTodos: (payload: object) => void;
	addTodo: (payload: object) => void;
	setCurrentTodo: (payload: { todo: string }) => void;
}

export const TodoHeaderBase = I18nMixin(ThemedMixin(WidgetBase));

@theme(css)
export class TodoHeader extends TodoHeaderBase<TodoHeaderProperties> {

	protected toggleTodos() {
		this.properties.toggleTodos({});
	}

	protected addTodo(event: KeyboardEvent) {
		if (event.which === 13) {
			this.properties.addTodo({});
		}
	}

	protected setCurrentTodo({ target: { value: todo } }: any): void {
		this.properties.setCurrentTodo({ todo });
	}

	protected render(): DNode {
		const { allCompleted, todo, todoCount } = this.properties;
		const messages = this.localizeBundle(appBundle);

		return v('header', [
			v('h1', { classes: this.theme(css.title) }, [ messages.appTitle ]),
			v('input', {
				key: 'todo-input',
				focus: true,
				classes: this.theme(css.newTodo),
				onkeydown: this.addTodo,
				oninput: this.setCurrentTodo,
				value: todo,
				placeholder: messages.editPlaceholder
			}),
			v('input', {
				classes: this.theme(css.toggleAll),
				onchange: this.toggleTodos,
				checked: allCompleted,
				type: 'checkbox',
				disabled: todoCount === 0 ? true : false
			})
		]);
	}
}
