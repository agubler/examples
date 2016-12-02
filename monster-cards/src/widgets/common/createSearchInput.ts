import { Widget, DNode, WidgetState } from 'dojo-widgets/interfaces';
import createWidgetBase from 'dojo-widgets/createWidgetBase';
import d from 'dojo-widgets/d';

export type SearchInput = Widget<WidgetState>

const createSearchInput = createWidgetBase.mixin({
	mixin: {
		getChildrenNodes: function(this: SearchInput): DNode[] {
			const input = d('input', { type: 'search' });
			const icon = d('i.fa.fa-2x.fa-search');

			return [ input, icon ];
		}
	}
});

export default createSearchInput;
