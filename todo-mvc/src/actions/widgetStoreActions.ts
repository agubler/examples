import widgetStore from '../stores/widgetStore';

export const putTodo = function({ afterAll = [] }: { afterAll: any[]}) {
	const completedCount = afterAll.filter(({ completed }: any) => completed).length;
	const activeCount = afterAll.length - completedCount;
	const allCompleted = afterAll.length === completedCount && afterAll.length;

	return widgetStore.patch({ id: 'todo-app', todos: afterAll, activeCount, completedCount, allCompleted });
};
