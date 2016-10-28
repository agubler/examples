import { EventTargettedObject } from 'dojo-interfaces/core';
import createRenderMixin, { RenderMixin, RenderMixinOptions, RenderMixinState } from 'dojo-widgets/mixins/createRenderMixin';
import createRenderableChildrenMixin from 'dojo-widgets/mixins/createRenderableChildrenMixin';
import createParentMapMixin, { ParentMapMixin, ParentMapMixinOptions } from 'dojo-widgets/mixins/createParentMapMixin';
import createImage from '../common/createImage';
import { VNodeProperties } from 'maquette';
import { Child } from 'dojo-widgets/mixins/interfaces';

export type CardState = RenderMixinState & {
	cardImage: string;
	cardId: string;
}

type CardOptions = RenderMixinOptions<CardState> & ParentMapMixinOptions<Child>;

export type Card = RenderMixin<CardState> & ParentMapMixin<Child>;

function manage(event: EventTargettedObject<Card>) {
	const { target: instance, type } = event;

	let image: RenderMixin<RenderMixinState>;

	switch (type) {
		case 'state:initialized':
			image = createImage({
				state: {
					src: instance.state.cardImage
				}
			});
		instance.append([ image ]);
		break;
	}
}

const createCard = createRenderMixin
	.mixin(createRenderableChildrenMixin)
	.mixin(createParentMapMixin)
	.mixin({
		initialize(instance: Card) {
			instance.on('state:initialized', manage);
		}
	})
	.extend({
		nodeAttributes: [
			function (this: Card): VNodeProperties {
				return {
					href: `#/cards/${this.state.cardId}`
				};
			}
		],
		classes: [ 'milestoneCard' ],
		tagName: 'a'
	});

export default createCard;
