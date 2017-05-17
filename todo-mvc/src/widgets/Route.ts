import Map from '@dojo/shim/Map';
import { beforeRender } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { BaseInjector } from '@dojo/widget-core/Injector';
import { parse as parsePath } from '@dojo/routing/lib/path';

export interface RouterInjectorProperties {
	onEnter: Function;
	onExit: Function;
}

export function createRouterContext(router: any) {
	const context: any = {
		router,
		currentSegment: 0,
		segments: [],
		matchedRoutes: [],
		started: false,
		routeParams: new Map()
	};

	router.on('navstart', (event: any) => {
		/*console.log('resetting context');*/
		const result = parsePath(event.path);
		context.segments = result.segments;
		context.started = true;
		context.currentSegment = 0;
		context.matchedRoutes = [];
		context.routeParams = new Map();
	});

	router.on('route', (event: any) => {
		/*console.log('hit route', event);*/
		context.matchedRoutes.push(event.path);
		context.routeParams.set(event.path, event.request.params);
	});
	return context;
}

export class RouterInjector extends BaseInjector<any> {

	private context: any;

	private _routeNode: (() => DNode) | undefined;

	private route: string;

	private isVisible: boolean;

	constructor(context: any) {
		super(context);
		this.context = context;
		context.router.on('navstart', (event: any) => {
			/*console.log('invalidating', (<any> this).constructor.name, event);*/
			this._routeNode = undefined;
			this.invalidate();
		});
	}

	@beforeRender()
	protected checkRoute(renderFunc: () => DNode, properties: any, children: any) {
		if (!this._routeNode) {
			const { getProperties = () => {} } = this.properties;
			if (!this.context.started) {
				this._routeNode = this.emptyRender;
			}

			const { route, onEnter, onExit } = getProperties(this.toInject(), this.properties.properties);
			this.route = route;
			const matched = this.context.matchedRoutes[0] === route;

			if (matched) {
				if (!this.isVisible) {
					onEnter(route, this.context.routeParams.get(route));
				}
				this.context.matchedRoutes.shift();
				this.isVisible = true;
				this._routeNode = renderFunc;
			}
			else {
				if (this.isVisible) {
					onExit(route);
				}
				this.isVisible = false;
				this._routeNode = this.emptyRender;
			}
		}

		return this._routeNode;
	}

	emptyRender() {
		return null;
	}

}

export interface WrappingContainerProperties {
	getProperties: any;
	getChildren: any;
}

/*export class WrappingContainer extends WidgetBase<WrappingContainerProperties, WNode> {
	protected render(): DNode {
		const child = this.children[0];
		if (child) {
			return w<BaseInjector<any>>(name, {
				bind: this,
				render: () => { return w(); },
				getProperties: this.properties.getProperties,
				properties: child.properties,
				getChildren: this.properties.getChildren,
				children: child.children
			});
		}
		return null;
	}
}*/
