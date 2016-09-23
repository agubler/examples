import { ComposeFactory } from 'dojo-compose/compose';
import createWidget, { Widget, WidgetState, WidgetOptions } from 'dojo-widgets/createWidget';

export type Label = Widget<WidgetState>;

export interface LabelFactory extends ComposeFactory<Label, WidgetOptions<WidgetState>> { }

const createLabel: LabelFactory = createWidget
	.extend({
		tagName: 'p'
	});

export default createLabel;
