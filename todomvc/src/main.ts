import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import TodoApp from './widgets/TodoApp';

import * as newTodoCss from './widgets/styles/todoHeader.css';

const root = document.querySelector('my-app') || undefined;

let ready = false;
let count = 0;

function stress() {
	if (!ready) {
		console.error('not ready');
	}
	else {
		for (let i = 0; i < 1000; i++) {
			const newTodo = <any> document.querySelector(`.${newTodoCss.newTodo}`);
			if (newTodo) {
				const changeEvent = <any> document.createEvent('Event');
				changeEvent.initEvent('input', true, true);
				newTodo.value = 'Something to do ' + ++count;
				newTodo.dispatchEvent(changeEvent);

				const keypressEvent = <any> document.createEvent('Event');
				keypressEvent.initEvent('keyup', true, true);
				keypressEvent.keyCode = 13;
				keypressEvent.which = 13;
				newTodo.dispatchEvent(keypressEvent);
			}
		}
	}
}

const Projector = ProjectorMixin(TodoApp);
const projector = new Projector();
projector.setProperties(<any> { stress });

projector.append(root).then(() => {
	ready = true;
	console.log('Attached!');
});
