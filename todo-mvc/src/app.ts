import { Widget, WidgetState } from 'dojo-interfaces/widgetBases';
import createWidgetBase from 'dojo-widgets/bases/createWidgetBase';
import { DNode } from 'dojo-widgets/bases/widgetBases';
import { todoInput } from './actions/userActions';
import d from 'dojo-widgets/util/d';

import createTitle from './widgets/createTitle';
import createMainSection from './widgets/createMainSection';
import createFocusableTextInput from './widgets/createFocusableTextInput';
import createTodoFooter from './widgets/createTodoFooter';

const createApp = createWidgetBase.mixin({
	mixin: {
		childNodeRenderers: [
			function(this: Widget<WidgetState>, registry: any, childState: any, stateFrom: any): DNode[] {
				return [
					d('header', {}, [
						d(createTitle, <any> { id: 'title', stateFrom }),
						d(createFocusableTextInput, <any> { id: 'new-todo', stateFrom, listeners: { keypress: todoInput } })
					]),
					d(createMainSection, <any> { id: 'main-section', stateFrom }),
					d(createTodoFooter, <any> { id: 'todo-footer', stateFrom })
				];
			}
		],
		classes: [ 'todoapp' ],
		tagName: 'section'
	}
});

export default createApp;
