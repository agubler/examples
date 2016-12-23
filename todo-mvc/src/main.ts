import router from './routes';
import { bindActions as bindTodoStoreActions } from './stores/todoStore';
import widgetStore from './stores/widgetStore';
import App from './App';

const root = document.getElementsByTagName('my-app')[0];

const app = new App({
	id: 'todo-app',
	root,
	stateFrom: widgetStore
});

app.append()
	.then(() => bindTodoStoreActions())
	.then(() => router.start());
