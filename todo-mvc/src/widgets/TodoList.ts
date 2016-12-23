import { WidgetBase, WidgetOptions, WidgetState, WidgetProperties } from 'dojo-widgets/WidgetBase';
import { w } from 'dojo-widgets/d';
import TodoItem, { TodoItemState } from './TodoItem';

interface TodoListState extends WidgetState {
	activeFilter: string;
	todos: TodoItemState[];
}

interface TodoListProperties extends WidgetProperties {
	activeFilter: string;
	todos: TodoItemState[];
}

interface TodoListOptions extends WidgetOptions<TodoListState, TodoListProperties> { }

class TodoList extends WidgetBase<TodoListState, TodoListProperties> {
	constructor(options: TodoListOptions) {
		super(options);
		this.tagName = 'ul';
		this.classes.push('todo-list');
	}

	getChildrenNodes() {
		const todos = this.state.todos || [];
		return todos
			.filter(this.filterTodos.bind(this))
			.map((todo) => w(TodoItem, { id: todo.id, properties: todo }));
	}

	private filterTodos(todo: TodoItemState) {
		const { activeFilter } = this.state;
		switch (activeFilter) {
			case 'completed':
				return !!todo.completed;
			case 'active':
				return !todo.completed;
			default:
				return true;
		}
	}
}

export default TodoList;
