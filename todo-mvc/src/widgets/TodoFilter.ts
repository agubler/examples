import { WidgetBase, WidgetOptions, WidgetState, WidgetProperties } from 'dojo-widgets/WidgetBase';
import { v }  from 'dojo-widgets/d';

interface TodoFilterState extends WidgetState {
	activeFilter: string;
};

interface TodoFilterProperties extends WidgetProperties {
	activeFilter: string;
};

interface TodoFilterOptions extends WidgetOptions<TodoFilterState, TodoFilterProperties> { }

class TodoFilter extends WidgetBase<TodoFilterState, TodoFilterProperties> {
	constructor(options: TodoFilterOptions) {
		super(options);
		this.tagName = 'ul';
		this.classes.push('filters');
	}

	getChildrenNodes() {
		const { activeFilter } = this.state;
		const filters = [ 'all', 'active', 'completed' ];
		return filters.map((filterItem) => {
			const label = filterItem[0].toUpperCase() + filterItem.substring(1);
			return v('li', {}, [
				v('a', {
					innerHTML: label,
					href: `#${filterItem}`,
					classes: {
						selected: activeFilter === filterItem
					}
				})
			]);
		});
	}
}

export default TodoFilter;
