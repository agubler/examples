import createApp from 'dojo-app/createApp';
import createWidgetBase from 'dojo-widgets/bases/createWidgetBase';
import { todoToggleAll, todoInput } from './actions/userActions';
import router from './routes';
import todoStore, { bindActions as bindTodoStoreActions } from './stores/todoStore';
import widgetStore from './stores/widgetStore';
import createCheckboxInput from './widgets/createCheckboxInput';
import createFocusableTextInput from './widgets/createFocusableTextInput';
import createTodoFooter from './widgets/createTodoFooter';
import createTodoList from './widgets/createTodoList';
import d from 'dojo-widgets/util/d';

import { Widget, WidgetState } from 'dojo-interfaces/widgetBases';
import { VNodeProperties } from 'dojo-interfaces/vdom';

const app = createApp({ defaultWidgetStore: widgetStore });

const createTitle = createWidgetBase.extend({
	tagName: 'h1',
	nodeAttributes: [
		function (this: Widget<WidgetState & { label: string }>): VNodeProperties {
			return { innerHTML: this.state.label };
		}
	]
});

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

app.registerStore('todo-store', todoStore);
app.loadDefinition({
	widgets: [
		{
			id: 'new-todo',
			factory: createFocusableTextInput,
			listeners: {
				keypress: todoInput
			}
		},
		{
			id: 'main-section',
			factory: createMainSection
		},
		{
			id: 'todo-footer',
			factory: createTodoFooter
		}
	],
	customElements: [
		{
			name: 'todo-title',
			factory: createTitle
		}
	]
});

Promise.resolve(app.realize(document.body))
	.then(() => bindTodoStoreActions())
	.then(() => router.start());
