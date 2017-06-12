import { v } from '@dojo/widget-core/d';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { theme, ThemeableMixin } from '@dojo/widget-core/mixins/Themeable';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import * as css from './styles/themeSwitcher.m.css';

interface ThemeSwitcherProperties extends WidgetProperties {
	changeTheme: (wantsPirate: boolean) => void;
}

const ThemeSwitherBase = ThemeableMixin(WidgetBase);

@theme(css)
export class ThemeSwitcher extends ThemeSwitherBase<ThemeSwitcherProperties> {
	onClick(event: MouseEvent) {
		this.properties.changeTheme((<HTMLInputElement> event.target!).checked);
	}

	render() {
		return v('label', {
			classes: this.classes(css.themeSwitcher)
		}, [
			v('span', [ 'Pirate Mode' ]),
			v('input', {
				type: 'checkbox',
				onclick: this.onClick,
				classes: this.classes(css.themeSwitcherCheckbox)
			})
		]);
	}
}

export default ThemeSwitcher;
