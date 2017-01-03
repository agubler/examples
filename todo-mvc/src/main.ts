import router from './routes';
import widgetStore from './stores/widgetStore';
import App from './App';

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

const app = new App({
	id: 'todo-app',
	root,
	properties: Object.assign({}, widgetStore.get(), { stress })
});

app.append()
	.then(() => router.start())
	.then(() => {
		ready = true;
	});
