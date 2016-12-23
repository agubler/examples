import { WidgetBase, WidgetOptions, WidgetState, WidgetProperties } from 'dojo-widgets/WidgetBase';
import { v, w } from 'dojo-widgets/d';
import TextInput from 'dojo-widgets/components/textinput/TextInput';
import Button from 'dojo-widgets/components/button/Button';
import Checkbox from './Checkbox';
import { todoEdit, todoEditInput, todoRemove, todoSave, todoToggleComplete } from '../actions/userActions';

interface LabelState extends WidgetState {
	label: string;
}

interface LabelProperties extends WidgetProperties {
	label: string;
}

interface LabelOptions extends WidgetOptions<LabelState, LabelProperties> { }

class Label extends WidgetBase<LabelState, LabelProperties> {
	constructor(options: LabelOptions) {
		super(options);
		this.tagName = 'label';
		this.nodeAttributes.push(this.labelAttributes);
	}

	private labelAttributes() {
		return {
			innerHTML: this.state.label,
			'aria-describedby': 'edit-instructions',
			tabindex: '0'
		};
	}
}

export interface TodoItemState extends WidgetState {
	label: string;
	editing: boolean;
	completed: boolean;
}

export interface TodoItemProperties extends WidgetProperties {
	label: string;
	editing: boolean;
	completed: boolean;
}

export interface TodoItemOptions extends WidgetOptions<TodoItemState, TodoItemProperties> { }

class TodoItem extends WidgetBase<TodoItemState, TodoItemProperties> {
	constructor(options: TodoItemOptions) {
		super(options);
		this.tagName = 'li';
		this.nodeAttributes.push(this.todoItemAttributes);
	}

	private todoItemAttributes() {
		const { completed, editing } = this.state;
		return {
			classes: { completed, editing }
		};
	}

	getChildrenNodes() {
		const state = this.state;
		const checked = state.completed;
		const label = state.label;
		const focused = state.editing;
		const inputOptions = {
			listeners: {
				onblur: todoSave,
				onkeypress: todoEditInput
			},
			properties: { todoItemId: state.id, value: label, focused, classes: [ 'edit' ] }
		};
		return [
			v('div.view', {}, [
				w(Checkbox, {
					listeners: { onchange: todoToggleComplete },
					properties: { todoItemId: state.id, classes: [ 'toggle' ], checked }
				}),
				w(Label, {
					listeners: {
						ondblclick: todoEdit,
						onkeypress: todoEdit
					},
					properties: { todoItemId: state.id, label }
				}),
				w(Button, {
					listeners: { onclick: todoRemove },
					properties: { todoItemId: state.id, classes: [ 'destroy' ] }
				})
			]),
			state.editing ?
				w(TextInput, inputOptions) : null
		];
	}
}

export default TodoItem;
