import createWidgetBase from 'dojo-widgets/bases/createWidgetBase';
import { Widget, WidgetOptions, WidgetState, DNode } from 'dojo-widgets/bases/widgetBases';
import d from 'dojo-widgets/util/d';
import createTodoItem, { TodoItemState } from './createTodoItem';

type TodoListState = WidgetState & {
	activeFilter?: string;
};

type TodoListOptions = WidgetOptions<TodoListState>;

export type TodoList = Widget<TodoListState>;

function filter(filterName: string, todo: TodoItemState): boolean {
	switch (filterName) {
		case 'completed':
			return !!todo.completed;
		case 'active':
			return !todo.completed;
		default:
			return true;
	}
}

const createTodoList = createWidgetBase
	.extend({
		childNodeRenderers: [
			function (this: TodoList, registry: any, childState: any, stateFrom: any): DNode[] {
				const activeFilter = this.state.activeFilter || '';
				const children = this.state.children || [];

				return children.map((id) => childState.get(id))
					.filter((todo: TodoItemState) => filter(activeFilter, todo))
					.map((todo: TodoItemState) => d(createTodoItem, <any> { id: todo.id, stateFrom }));
				}
		],
		tagName: 'ul'
	});

export default createTodoList;
