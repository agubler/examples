import { EventTargettedObject } from 'dojo-interfaces/core';
import createRenderableChildrenMixin from 'dojo-widgets/mixins/createRenderableChildrenMixin';
import createRenderMixin, { RenderMixin, RenderMixinState, RenderMixinOptions } from 'dojo-widgets/mixins/createRenderMixin';
import createParentMapMixin, { ParentMapMixin, ParentMapMixinOptions } from 'dojo-widgets/mixins/createParentMapMixin';
import createCssTransitionMixin from 'dojo-widgets/mixins/createCssTransitionMixin';
import createWidget from 'dojo-widgets/createWidget';
import { Child } from 'dojo-widgets/mixins/interfaces';
import createImage from '../common/createImage';
import createIconLink from '../common/createIconLink';
import { h, VNode } from 'maquette';

export type MilestoneCardDetails = {
	name: string;
	tagline: string;
	description: string;
	cardImage: string;
	favouriteCount: number;
	cardId: string;
}

export type CardDescriptionState = RenderMixinState & MilestoneCardDetails;

type CardDescriptionOptions = RenderMixinOptions<CardDescriptionState> & ParentMapMixinOptions<Child>;

type CardDescription = RenderMixin<CardDescriptionState> & ParentMapMixin<Child>;

const favouriteHref = '/api/favourite/';

function manage(event: EventTargettedObject<CardDescription>) {
	const { target: instance, type } = event;

	let cardImage: RenderMixin<RenderMixinState>;
	let name: RenderMixin<RenderMixinState>;
	let tagline: RenderMixin<RenderMixinState>;
	let description: RenderMixin<RenderMixinState>;
	let favoriteCount: RenderMixin<RenderMixinState>;
	let addToFavoritesLink: RenderMixin<RenderMixinState>;
	let facebookLink: RenderMixin<RenderMixinState>;
	let twitterLink: RenderMixin<RenderMixinState>;

console.log(type);

	switch (type) {
		case 'state:initialized':
			cardImage = createImage({
				id: 'cardImage',
				state: {
					id: 'cardImage',
					src: instance.state.cardImage,
					classes: [ 'cardImage' ]
				}
			});
			name = createWidget({
				id: 'name',
				state: {
					id: 'name',
					label: instance.state.name
				},
				tagName: 'h1'
			});
			tagline = createWidget({
				id: 'tagline',
				state: {
				id: 'tagline',
					label: instance.state.tagline,
					classes: [ 'tagline' ]
				},
				tagName: 'strong'
			});
			description = createWidget({
				id: 'description',
				state: {
				id: 'description',
					label: instance.state.description
				},
				tagName: 'p'
			});
			favoriteCount = createWidget({
				id: 'favoriteCount',
				state: {
				id: 'favoriteCount',
					label: instance.state.favouriteCount.toString(),
					classes: [ 'favouriteCount' ]
				},
				tagName: 'span'
			});
			addToFavoritesLink = createIconLink({
				id: 'addToFavoritesLink',
				state: {
				id: 'addToFavoritesLink',
					classes: [ 'button' ],
					href: favouriteHref + instance.state.id,
					iconClass: [ 'fa', 'fa-heart-o'],
					text: 'Add to favourites'
				}
			});
			twitterLink = createIconLink({
				id: 'twitterLink',
				state: {
				id: 'twitterLink',
					classes: [ 'button' ],
					href: 'http://www.twitter.com',
					iconClass: [ 'fa', 'fa-twitter' ]
				}
			});
			facebookLink = createIconLink({
				id: 'facebookLink',
				state: {
				id: 'facebookLink',
					classes: [ 'button' ],
					href: 'http://www.facebook.com',
					iconClass: [ 'fa', 'fa-facebook' ]
				}
			});
			instance.append([ cardImage, name, tagline, description, favoriteCount, addToFavoritesLink, twitterLink, facebookLink ]);
		break;
		case 'state:changed':
			favoriteCount = <RenderMixin<RenderMixinState>> instance.children.get('favoriteCount');

			favoriteCount.setState({ label: instance.state.favouriteCount.toString() });
		break;
	}
}

const createCardDescription = createRenderMixin
	.mixin(createCssTransitionMixin)
	.mixin(createRenderableChildrenMixin)
	.mixin(createParentMapMixin)
	.mixin({
		initialize(instance: CardDescription, options: CardDescriptionOptions) {
			instance.on('state:changed', manage);
			instance.on('state:initialized', manage);
		}
	})
	.extend({
		tagName: 'card-details-description',
		getChildrenNodes(this: CardDescription): VNode[] {
			if (this.children.size) {
				return [
					this.children.get('cardImage').render(),
					h('article', [
						this.children.get('name').render(),
						this.children.get('tagline').render(),
						this.children.get('description').render(),
						h('span', 'Favourited: '),
						this.children.get('favoriteCount').render(),
						h('div.buttonHolder', [
							this.children.get('addToFavoritesLink').render(),
							this.children.get('twitterLink').render(),
							this.children.get('facebookLink').render()
						])
					])
				];
			}
			else {
				console.log('no children');
			}
		}
	});

export default createCardDescription;
