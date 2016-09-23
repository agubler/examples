import { ComposeFactory } from 'dojo-compose/compose';
import createWidget, { Widget, WidgetState, WidgetOptions } from 'dojo-widgets/createWidget';
import createParentListMixin, { ParentListMixin, ParentListMixinOptions } from 'dojo-widgets/mixins/createParentListMixin';
import createRenderableChildrenMixin from 'dojo-widgets/mixins/createRenderableChildrenMixin';
import createStatefulChildrenMixin, { StatefulChildrenState, StatefulChildrenOptions } from 'dojo-widgets/mixins/createStatefulChildrenMixin';
import { Child } from 'dojo-widgets/mixins/interfaces';

export interface LayoutContainerState extends WidgetState, StatefulChildrenState {
	label?: string;
}

export type LayoutContainerOptions = WidgetOptions<LayoutContainerState> & ParentListMixinOptions<Child> & StatefulChildrenOptions<Child, LayoutContainerState>;

export type LayoutContainer = Widget<LayoutContainerState> & ParentListMixin<Child>;

export interface LayoutContainerFactory extends ComposeFactory<LayoutContainer, LayoutContainerOptions> { }

const createLayoutContainer: LayoutContainerFactory = createWidget
	.mixin(createParentListMixin)
	.mixin(createRenderableChildrenMixin)
	.mixin(createStatefulChildrenMixin);

export default createLayoutContainer;
