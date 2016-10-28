import { ComposeFactory } from 'dojo-compose/compose';
import createRenderMixin, { RenderMixin, RenderMixinOptions, RenderMixinState } from 'dojo-widgets/mixins/createRenderMixin';
import { VNodeProperties } from 'maquette';
import createParentMapMixin, { ParentMapMixin, ParentMapMixinOptions } from 'dojo-widgets/mixins/createParentMapMixin';
import createRenderableChildrenMixin from 'dojo-widgets/mixins/createRenderableChildrenMixin';
import { EventTargettedObject } from 'dojo-interfaces/core';
import createIcon from './createIcon';
import createWidget from 'dojo-widgets/createWidget';
import { Child } from 'dojo-widgets/mixins/interfaces';

export type IconLinkState = RenderMixinState & {
	href?: string;
	iconClass?: string[];
	text?: string;
}

type IconLinkOptions = RenderMixinOptions<IconLinkState> & ParentMapMixinOptions<Child>;

export type IconLink = RenderMixin<IconLinkState> & ParentMapMixin<Child>;

type IconLinkFactory = ComposeFactory<IconLink, IconLinkOptions>;

function manage(event: EventTargettedObject<IconLink>) {
	const { target: instance, type } = event;

	let icon: RenderMixin<RenderMixinState>;
	let text: RenderMixin<RenderMixinState>;

	switch (type) {
		case 'state:initialized':
			icon = createIcon({ id: 'icon', state: { id: 'icon', classes: instance.state.iconClass } });
			text = createWidget({
				id: 'text',
				tagName: 'span',
				state: { id: 'text', label: instance.state.text }
			});
			instance.append([ icon, text ]);
		break;
		case 'state:changed':
			icon = <RenderMixin<RenderMixinState>> instance.children.get('icon');
			text = <RenderMixin<RenderMixinState>> instance.children.get('text');

			icon.setState({ classes: instance.state.iconClass });
			text.setState({ label: instance.state.text });
		break;
	}
}

const createIconLink: IconLinkFactory = createRenderMixin
	.mixin(createRenderableChildrenMixin)
	.mixin(createParentMapMixin)
	.mixin({
		initialize(instance) {
			instance.on('state:initialized', manage);
			instance.on('state:changed', manage);
		}
	})
	.extend({
		nodeAttributes: [
			function (this: IconLink): VNodeProperties {
				const { href } = this.state;
				return href ? { href } : {};
			}
		],
		tagName: 'a'
	});

export default createIconLink;
