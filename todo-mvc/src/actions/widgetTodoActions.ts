import createAction, { AnyAction } from 'dojo-actions/createAction';
import { App } from 'dojo-app/createApp';
import createTodoItem from './../widgets/createTodoItem';

function configure (options: {widgetStore: any, app: App}) {
	const action = <any> this;
	action.widgetStore = options.widgetStore;
	action.app = options.app;
};

export const updateHeaderAndFooter: AnyAction = createAction({
	configure,
	do(options: any) {
		const { widgetStore } = <any> this;
		const { afterAll } = options;
		const completedCount = afterAll.filter((todo: any) => todo.completed).length;
		const activeCount = afterAll.filter((todo: any) => !todo.completed).length;
		const hidden = afterAll.length ? [] : ['hidden'];
		const allCompleted = afterAll.length === completedCount;

		widgetStore.patch({
			id: 'todo-footer',
			completedCount,
			activeCount,
			classes: ['footer', ...hidden]
		});

		widgetStore.patch({
			id: 'todo-toggle',
			checked: allCompleted,
			classes: ['toggle-all', ...hidden]
		});
	}
});

export const deleteTodo: AnyAction = createAction({
	configure,
	do(options: any) {
		const { widgetStore } = <any> this;
		const { deletes, afterAll } = options;
		if (deletes.length) {
			const item = deletes[0];
			const children = afterAll.filter((todoItem: any) => todoItem.id !== item)
			.map((item: any) => item.id);
			return widgetStore.delete(item).patch({ id: 'todo-list', children });
		}
	}
});

export const putTodo: AnyAction = createAction({
	configure,
	do(options: any) {
debugger;
		const { widgetStore, app }: { widgetStore: any, app: App } = <any> this;
		const item = options.updates[0].item;

		if (options.type === 'add') {
			app.registerWidgetFactory(item.id, createTodoItem);
		}
		return widgetStore.get('todo-list').then((todoList: any) => {
			todoList[0].children = [...todoList[0].children, item.id];
			widgetStore.put(item);
			widgetStore.put(todoList[0]);
		});
	}
});
