import { putTodo } from '../actions/widgetStoreActions';
import Observable from 'dojo-shim/Observable';
import { assign } from 'dojo-core/lang';
import { from } from 'dojo-shim/array';
import Map from 'dojo-shim/Map';

export interface Item {
	id: string;
	label?: string;
	completed?: boolean;
}

class TodoStore {
	private todoStoreData: Map<string, Item> = new Map<string, Item>();
	private observable: Observable<Map<string, Item>>;
	private observer: any;

	constructor() {
		this.observable = new Observable((observer) => {
			this.observer = observer;
		});

		/*this.observable.subscribe((items: Map<string, Item>) => {
			[>console.log('patching');<]
			putTodo({ afterAll: from(items.values()) });
		});*/
	}

	patch(patchItem: Item | Item[]) {
		let items: Item | Item[];
		if (Array.isArray(patchItem)) {
			items = patchItem.map((item) => {
				return this.patchOne(item);
			});
		}
		else {
			items = this.patchOne(patchItem);
		}

		/*this.observer.next(this.todoStoreData);*/
		putTodo({ afterAll: from(this.todoStoreData.values()) });
		return items;
	}

	private patchOne(patchItem: Item) {
		let item = this.todoStoreData.get(patchItem.id);
		if (item) {
			assign(item, patchItem);
		}
		else {
			item = assign({}, patchItem);
		}
		this.todoStoreData.set(item.id, item);
		return item;
	}

	add(item: Item) {
		return this.patch(item);
	}

	delete(id: string | string[]) {
		if (Array.isArray(id)) {
			id.forEach(this.deleteOne.bind(this));
		}
		else {
			this.deleteOne(id);
		}
		putTodo({ afterAll: from(this.todoStoreData.values()) });
		/*this.observer.next(this.todoStoreData);*/
	}

	private deleteOne(id: string) {
		if (this.todoStoreData.has(id)) {
			this.todoStoreData.delete(id);
		}
	}

	get(id?: string): Item | Item[] | undefined {
		if (id) {
			return this.todoStoreData.get(id);
		}
		else {
			return from(this.todoStoreData.values());
		}
	}

	fetch(id?: string): Item | Item[] | undefined {
		return this.get(id);
	}

	query(filter: (item: Item) => boolean): Item[] {
		return from(this.todoStoreData.values()).filter(filter);
	}
}

export default new TodoStore;
