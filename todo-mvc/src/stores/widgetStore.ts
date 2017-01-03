import Observable from 'dojo-shim/Observable';
import { assign } from 'dojo-core/lang';
import { from } from 'dojo-shim/array';
import Map from 'dojo-shim/Map';

class WidgetStore {
	private todoStoreData: Map<string, any> = new Map<string, any>();
	private observable: Observable<Map<string, any>>;
	private observer: any;
	private attachedInstance: any;

	constructor(options: any) {
		this.todoStoreData.set(options.id, options);
		this.observable = new Observable((observer) => {
			this.observer = observer;
		});

		this.observable.subscribe((items: Map<string, any>) => {
			if (this.attachedInstance) {
				this.attachedInstance.setState(items.get('todo-app'));
			}
		});
	}

	patch(patchItem: any | any[]) {
		let items: any | any[];
		if (Array.isArray(patchItem)) {
			items = patchItem.map((item) => {
				return this.patchOne(item);
			});
		}
		else {
			items = this.patchOne(patchItem);
		}

		/*this.observer.next(this.todoStoreData);*/
		this.attachedInstance.setState(this.todoStoreData.get('todo-app'));
		return items;
	}

	private patchOne(patchItem: any) {
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

	add(item: any) {
		return this.patch(item);
	}

	delete(id: string | string[]) {
		if (Array.isArray(id)) {
			id.forEach(this.deleteOne);
		}
		else {
			this.deleteOne(id);
		}
		/*this.observer.next(this.todoStoreData);*/
		this.attachedInstance.setState(this.todoStoreData.get('todo-app'));
	}

	private deleteOne(id: string) {
		if (this.todoStoreData.has(id)) {
			this.todoStoreData.delete(id);
		}
	}

	get(id?: string): any | any[] | undefined {
		if (id) {
			return this.todoStoreData.get(id);
		}
		else {
			return from(this.todoStoreData.values());
		}
	}

	fetch(id?: string): any | any[] | undefined {
		return this.get(id);
	}

	query(filter: (item: any) => boolean): any[] {
		return from(this.todoStoreData.values());
	}

	attach(instance: any) {
		this.attachedInstance = instance;
	}
}

export default new WidgetStore({});
