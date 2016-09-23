import { ComposeFactory } from 'dojo-compose/compose';
import createWidget, { Widget, WidgetState, WidgetOptions } from 'dojo-widgets/createWidget';
import createRenderableChildrenMixin from 'dojo-widgets/mixins/createRenderableChildrenMixin';
import createStatefulChildrenMixin, { StatefulChildren, StatefulChildrenState, StatefulChildrenOptions } from 'dojo-widgets/mixins/createStatefulChildrenMixin';
import { Child } from 'dojo-widgets/mixins/interfaces';

import createLink, { LinkState } from './../common/createLink';
import createHeader from './../common/createHeader';

interface CardHeaderItemState extends LinkState, StatefulChildrenState {
	buttonName?: string;
}

export interface CardHeaderItemOptions extends WidgetOptions<CardHeaderItemState>, StatefulChildrenOptions<Child, CardHeaderItemState> { }

export type CardHeaderItem = Widget<WidgetState> & StatefulChildren<Child, CardHeaderItemState>;

export interface CardHeaderItemFactory extends ComposeFactory<CardHeaderItem, CardHeaderItemOptions> { }

const createCardHeaderItem: CardHeaderItemFactory = createWidget
	.mixin(createRenderableChildrenMixin)
	.mixin({
		mixin: createStatefulChildrenMixin,
		initialize(instance: CardHeaderItem, options: CardHeaderItemOptions) {
			instance.createChildren({
				'headerLabel': {
					factory: createHeader,
					options: {
						state: {
							label: 'Monsters'
						}
					}
				},
				'viewAll': {
					factory: createLink,
					options: {
						state: {
							href: '#cards',
							label:  'View All'
						}
					}
				}
			})
			.then(() => {
				instance.invalidate();
			});
		}
	});

export default createCardHeaderItem;
