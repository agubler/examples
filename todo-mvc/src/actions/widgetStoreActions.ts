import createAction from 'dojo-actions/createAction';
import { includes } from 'dojo-shim/array';

import { ChangeRecord } from '../stores/todoStore';
import widgetStore from '../stores/widgetStore';

export const updateHeaderAndFooter = createAction({
	do({ afterAll }: ChangeRecord) {
		const completedCount = afterAll.filter(({ completed }) => completed).length;
		const activeCount = afterAll.length - completedCount;
		const hidden = afterAll.length ? [] : ['hidden'];
		const allCompleted = afterAll.length === completedCount;

		return Promise.all([
			widgetStore.patch({
				id: 'todo-footer',
				completedCount,
				activeCount,
				classes: ['footer', ...hidden]
			}),

			widgetStore.patch({
				id: 'todo-toggle',
				checked: allCompleted,
				classes: ['toggle-all', ...hidden]
			})
		]);
	}
});

export const updateTodos = createAction({
	do({ beforeAll, afterAll, puts, deletes }: ChangeRecord) {
		const children = afterAll.map(({ id }) => id);

		if (puts.length) {
			if (includes(beforeAll.map(({ id }) => id), puts[0].id)) {
				return widgetStore.patch(puts[0]);
			}

			return widgetStore.patch(puts[0]).then(() => {
				return widgetStore.patch({ id: 'todo-list', children });
			});
		}
		else {
			widgetStore.patch({ id: 'todo-list', children });
			widgetStore.delete(deletes[0]);
		}
	}
});
