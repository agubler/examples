import createRenderableChildrenMixin from 'dojo-widgets/mixins/createRenderableChildrenMixin';
import createRenderMixin from 'dojo-widgets/mixins/createRenderMixin';
import createStatefulChildrenMixin from 'dojo-widgets/mixins/createStatefulChildrenMixin';

import createSearchInput from './../common/createSearchInput';
import createFavourites from './createFavourites';

const createNavActions = createRenderMixin
	.mixin(createRenderableChildrenMixin)
	.mixin({
		mixin: createStatefulChildrenMixin,
		initialize(instance) {
			instance
				.createChildren({
					searchInput: {
						factory: createSearchInput,
						options: {
							state: {
								classes: [ 'search' ]
							}
						}
					},
					favIcon: {
						factory: createFavourites
					}
				})
				.then((widgets: any) => {
					instance.invalidate();
				});
		}
	})
	.extend({
		tagName: 'ul'
	});

export default createNavActions;
