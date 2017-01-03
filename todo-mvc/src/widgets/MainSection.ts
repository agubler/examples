import { WidgetBase, WidgetState, WidgetProperties, WidgetOptions } from 'dojo-widgets/WidgetBase';
import { w } from 'dojo-widgets/d';

import { todoToggleAll } from '../actions/userActions';
import Checkbox from './Checkbox';
import TodoList, { TodoListProperties } from './TodoList';

class MainSection extends WidgetBase<WidgetState, WidgetProperties> {
	constructor(options: WidgetOptions<WidgetState, WidgetProperties>) {
		super(options);
		this.tagName = 'section';
		this.classes.push('main');
	}

	getChildrenNodes() {
		const { state } = this;
		const checkBoxOptions = {
			id: 'todo-toggle',
			properties: {
				checked: (<any> state).allCompleted,
				classes: [ 'toggle-all' ]
			},
			listeners: {
				onchange: todoToggleAll
			}
		};

		return [
			w(Checkbox, checkBoxOptions),
			w(TodoList, { id: 'todo-list', properties: <TodoListProperties> state })
		];
	}
}

export default MainSection;
