import { WidgetBase, WidgetOptions, WidgetState, WidgetProperties } from 'dojo-widgets/WidgetBase';

export interface CheckboxState extends WidgetState {
	checked: boolean;
};

export interface CheckboxProperties extends WidgetProperties {
	checked: boolean;
};

export interface CheckboxOptions extends WidgetOptions<CheckboxState, CheckboxProperties> {}

class Checkbox extends WidgetBase<CheckboxState, CheckboxProperties> {
	private type: string = 'input';

	constructor(options: WidgetOptions<CheckboxState, CheckboxProperties>) {
		super(options);
		this.nodeAttributes.push(this.checkBoxAttributes);
		this.type = 'checkbox';
		this.tagName = 'input';
	}

	private checkBoxAttributes() {
		const { type, state } = this;
		const { checked } = state;
		return { type, checked: Boolean(checked) };
	}
}

export default Checkbox;
