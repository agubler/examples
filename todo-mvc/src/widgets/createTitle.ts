import { Widget, WidgetState, WidgetProperties } from 'dojo-widgets/interfaces';
import { VNodeProperties } from 'dojo-interfaces/vdom';
import createWidgetBase from 'dojo-widgets/createWidgetBase';

const createTitle = createWidgetBase.mixin({
	mixin: {
		tagName: 'h1',
		nodeAttributes: [
			function (this: Widget<WidgetState & { label: string }, WidgetProperties>): VNodeProperties {
				return { innerHTML: this.state.label };
			}
		]
	}
});

export default createTitle;
