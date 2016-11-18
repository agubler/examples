import { Widget, WidgetState } from 'dojo-interfaces/widgetBases';
import createWidgetBase from 'dojo-widgets/bases/createWidgetBase';
import d from 'dojo-widgets/util/d';

import { todoToggleAll } from '../actions/userActions';
import createCheckboxInput from './createCheckboxInput';
import createTodoList from './createTodoList';

const createMainSection = createWidgetBase.extend({
	tagName: 'section',
	childNodeRenderers: [
		function (this: Widget<WidgetState>, registry: any, childState: any, stateFrom: any): any[] {
			const todoListOptions = {
				id: 'todo-list',
				stateFrom
			};

			const checkBoxOptions = {
				id: 'todo-toggle',
				stateFrom,
				listeners: {
					change: todoToggleAll
				}
			};

			return [
				d(createTodoList, <any> todoListOptions),
				d(createCheckboxInput, <any> checkBoxOptions)
			];
		}
	]
});

export default createMainSection;
