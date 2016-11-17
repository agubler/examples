import { Widget, DNode, WidgetState } from 'dojo-interfaces/widgetBases';
import createWidgetBase from 'dojo-widgets/bases/createWidgetBase';
import d from 'dojo-widgets/util/d';
import createCssTransitionMixin from 'dojo-widgets/mixins/createCssTransitionMixin';
import createCard, { CardState } from '../card/createCard';

export type CardNavBarState = WidgetState & {
	cards: CardState[];
}

export type CardNavBar = Widget<CardNavBarState>;

const createCardNavBar = createWidgetBase
	.mixin(createCssTransitionMixin)
	.extend({
		classes: [ 'animated', 'cardNavBar' ],
		childNodeRenderers: [
			function(this: CardNavBar): DNode[] {
				const { cards } = this.state;

				const cardNodes = cards.map((card) => {
					return d(createCard, { id: card.cardId, state: card });
				});

				return cardNodes;
			}
		]
	});

export default createCardNavBar;
