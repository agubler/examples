import Projector, { ProjectorOptions } from 'dojo-widgets/Projector';
import { todoInput } from './actions/userActions';
import { v, w } from 'dojo-widgets/d';

import Title from './widgets/Title';
import MainSection from './widgets/MainSection';
import TextInput from 'dojo-widgets/components/textinput/TextInput';
import TodoFooter, { TodoFooterState } from './widgets/TodoFooter';
import widgetStore from './stores/widgetStore';

class App extends Projector {

	constructor(options: ProjectorOptions) {
		super(options);
		this.tagName = 'section';
		this.classes.push('todoapp');
		widgetStore.attach(this);
	}

	getChildrenNodes() {
		const { state } = this;
		const { todo, todos } = state;
		const newTodoOptions = {
			id: 'new-todo',
			properties: {
				id: 'new-todo',
				classes: ['new-todo'],
				focused: true,
				value: todo ? todo : '',
				placeholder: 'What needs to be done?'
			},
			listeners: { onkeyup: todoInput }
		};
		const classes = todos && todos.length ? [] : [ 'hidden' ];
		const todoFooterState: TodoFooterState = Object.assign({ classes }, state);
		return [
			v('button', { key: this, bind: this, type: 'button', onclick: (<any> this.properties).stress, styles: { height: '70px', width: '150px', 'background-color': 'red' }, innerHTML: 'stress' }),
			v('header', {}, [
				w(Title, { id: 'title', properties: { label: 'todos' } }),
				w(TextInput, newTodoOptions)
			]),
			w(MainSection, { id: 'main-section', properties: state }),
			w(TodoFooter, { id: 'todo-footer', properties: todoFooterState })
		];
	}
}

export default App;
