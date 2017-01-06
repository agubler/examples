import router from './routes';
import { bindActions as bindTodoStoreActions } from './stores/todoStore';
import widgetStore from './stores/widgetStore';
import createApp from './createApp';

const root = document.getElementsByTagName('my-app')[0];

let ready = false;
let count = 0;
function stress() {
	if (!ready) {
		console.error('not ready');
	}
	else {
		for (let i = 0; i < 1000; i++) {
			const newTodo = <any> document.querySelector('.new-todo');
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

const app = createApp({
	id: 'todo-app',
	root,
	properties: { stress },
	stateFrom: widgetStore
});

app.append()
	.then(() => bindTodoStoreActions())
	.then(() => router.start())
	.then(() => {
		ready = true;
	});
