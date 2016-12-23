import { WidgetBase, WidgetOptions, WidgetState, WidgetProperties } from 'dojo-widgets/WidgetBase';
import { v, w } from 'dojo-widgets/d';
import Button from 'dojo-widgets/components/button/Button';
import { clearCompleted } from '../actions/userActions';
import TodoFilter from './TodoFilter';

export interface TodoFooterState extends WidgetState {
	activeFilter: string;
	activeCount: number;
	completedCount: number;
}

export interface TodoFooterProperties extends WidgetProperties {
	activeFilter: string;
	activeCount: number;
	completedCount: number;
}

export type TodoFooterOptions = WidgetOptions<TodoFooterState, TodoFooterProperties>;

class TodoFooter extends WidgetBase<TodoFooterState, TodoFooterProperties> {
	constructor(options: TodoFooterOptions) {
		super(options);
		this.tagName = 'footer';
		this.classes.push('footer');
	}

	getChildrenNodes() {
		const { activeCount, activeFilter, completedCount } = this.state;
		const countLabel = activeCount === 1 ? 'item' : 'items';

		return [
			v('span', { 'class': 'todo-count' }, [
				v('strong', [activeCount + ' ']),
				v('span', [countLabel + ' left'])
			]),
			w(TodoFilter, {
				properties: {
					classes: [ 'filters' ],
					activeFilter
				}
			}),
			completedCount ? w(Button, {
				listeners: {
					onclick: clearCompleted
				},
				properties: {
					label: 'Clear completed',
					classes: [ 'clear-completed' ]
				}
			}) : null
		];
	}
}

export default TodoFooter;
