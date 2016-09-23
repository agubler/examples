import { ComposeFactory } from 'dojo-compose/compose';
import createWidget, { Widget, WidgetState, WidgetOptions } from 'dojo-widgets/createWidget';
import createRenderableChildrenMixin from 'dojo-widgets/mixins/createRenderableChildrenMixin';
import createStatefulChildrenMixin, { StatefulChildren, StatefulChildrenState, StatefulChildrenOptions } from 'dojo-widgets/mixins/createStatefulChildrenMixin';
import { Child } from 'dojo-widgets/mixins/interfaces';

import createImage from './../common/createImage';
import createLink from './../common/createLink';
import createLabel from './../common/createLabel';

interface CardItemState extends StatefulChildrenState {}

export interface CardItemOptions extends WidgetOptions<CardItemState>, StatefulChildrenOptions<Child, CardItemState> { }

export type CardItem = Widget<WidgetState> & StatefulChildren<Child, CardItemState>;

export interface CardItemFactory extends ComposeFactory<CardItem, CardItemOptions> { }

const createCardItem: CardItemFactory = createWidget
	.mixin(createRenderableChildrenMixin)
	.mixin({
		mixin: createStatefulChildrenMixin,
		initialize(instance: any, options: any) {

			instance.createChildren({
				'card': {
					factory: createImage,
					options: {
						state: {
							src: options.state.src,
							classes: [ 'image' ]
						}
					}
				},
				'cardLink': {
					factory: createLink,
					options: {
						state: {
							href: '#card/' + options.state.id,
							label:  options.state.name
						}
					}
				},
				'cardDescription': {
					factory: createLabel,
					options: {
						state: {
							label: options.state.description
						}
					}
				}
			})
			.then(() => {
				instance.invalidate();
			});
		}
	});

export default createCardItem;
