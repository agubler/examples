import { EventTargettedObject } from 'dojo-interfaces/core';
import createRenderMixin, { RenderMixin, RenderMixinOptions, RenderMixinState } from 'dojo-widgets/mixins/createRenderMixin';
import createRenderableChildrenMixin from 'dojo-widgets/mixins/createRenderableChildrenMixin';
import createParentMapMixin, { ParentMapMixin, ParentMapMixinOptions } from 'dojo-widgets/mixins/createParentMapMixin';
import createCard from './createCard';
import createWidget from 'dojo-widgets/createWidget';
import { Child } from 'dojo-widgets/mixins/interfaces';

export type CardSummaryState = RenderMixinState & {
	name: string;
	cardImage: string;
	score: number;
	cardId: string;
}

type CardSummaryOptions = RenderMixinOptions<CardSummaryState> & ParentMapMixinOptions<Child>;

export type CardSummary = RenderMixin<CardSummaryState> & ParentMapMixin<Child>;

function manage(event: EventTargettedObject<CardSummary>) {
	const { target: instance, type } = event;

	let card: RenderMixin<RenderMixinState>;
	let name: RenderMixin<RenderMixinState>;
	let score: RenderMixin<RenderMixinState>;

	switch (type) {
		case 'state:initialized':
			card = createCard({
				state: {
					cardId: instance.state.cardId,
					cardImage: instance.state.cardImage
				}
			});
			name = createWidget({
				state: {
					label: instance.state.name
				},
				tagName: 'h2'
			});
			score = createWidget({
				state: {
					classes: [ 'points' ],
					label: `milestone points: ${instance.state.score}`
				},
				tagName: 'p'
			});
			instance.append([ card, name, score ]);
		break;
	}
}

const createCardSummary = createRenderMixin
	.mixin(createRenderableChildrenMixin)
	.mixin(createParentMapMixin)
	.mixin({
		initialize(instance: CardSummary) {
			instance.on('state:initialized', manage);
			instance.on('state:changed', manage);
		}
	}).extend({
		classes: [ 'cardSummary' ]
	});

export default createCardSummary;
