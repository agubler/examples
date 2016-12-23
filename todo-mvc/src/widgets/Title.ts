import { WidgetBase, WidgetState, WidgetProperties, WidgetOptions } from 'dojo-widgets/WidgetBase';

export interface TitleState extends WidgetState {
	label: string;
}

export interface TitleProperties extends WidgetProperties {
	label: string;
}

class Title extends WidgetBase<TitleState, TitleProperties> {
	constructor(options: WidgetOptions<TitleState, TitleProperties>) {
		super(options);
		this.tagName = 'h1';
		this.nodeAttributes.push(this.titleAttributes);
	}

	private titleAttributes() {
		return { innerHTML: this.state.label };
	}
}

export default Title;
