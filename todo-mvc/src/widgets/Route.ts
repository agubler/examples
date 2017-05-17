import Map from '@dojo/shim/Map';
import { beforeRender } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { BaseInjector } from '@dojo/widget-core/Injector';
import { Router } from '@dojo/routing/Router';
import { Route } from '@dojo/routing/Route';

/**
 * Config for registering routes
 */
export interface RouteConfig {
	path: string;
	children: RouteConfig[];
}

/**
 * Register the route config with a router
 */
export function registerRoutes(routes: any[], router: Router<any>, parentRoute?: Route<any, any>, depth = -1) {
	depth++;
	routes.forEach((routeDef) => {
		const route = new Route({
			path: routeDef.path,
			exec(request) {
				router.emit<any>({ type: 'route', depth, path: routeDef.path, chunk: routeDef.path, request });
			}
		});
		if (parentRoute !== undefined) {
			parentRoute.append(route);
		}
		else {
			router.append(route);
		}
		if (routeDef.children) {
			registerRoutes(routeDef.children, router, route, depth);
		}
	});
}

/**
 * Context for a router
 */
interface RouterContext {
	router: Router<any>;
	matchedRoutes: Map<any, any>;
	started: boolean;
	routeParams: Map<any, any>;
	depth: number;
}

/**
 * Create a router context from the router instance
 */
export function createRouterContext(router: Router<any>) {
	const context: RouterContext = {
		router,
		matchedRoutes: new Map(),
		started: false,
		routeParams: new Map(),
		depth: 0
	};

	router.on('navstart', (event: any) => {
		context.started = true;
		context.matchedRoutes = new Map();
		context.routeParams = new Map();
	});

	router.on('route', (event: any) => {
		const routes = context.matchedRoutes.get(event.depth);
		if (routes === undefined) {
			context.matchedRoutes.set(event.depth, [ event.path ]);
		}
		else {
			routes.push(event.path);
			context.matchedRoutes.set(event.depth, routes);
		}

		context.routeParams.set(event.path, {
			params: event.request.params,
			depth: event.depth
		});
	});
	return context;
}

/**
 * No opertation render for when routes don't match
 */
function noopRender(): DNode {
	return null;
}

/**
 * Router Injector class
 */
export class RouterInjector extends BaseInjector<RouterContext> {

	/**
	 * This would just be `context` if it was exposed.
	 */
	private _routerContext: RouterContext;

	/**
	 * saved render function
	 */
	private _routeRenderFunc: (() => DNode) | undefined;

	/**
	 * if the route is visible
	 */
	private _isVisible: boolean;

	/**
	 * Create the injector
	 */
	constructor(context: RouterContext) {
		super(context);
		this._routerContext = context;
		context.router.on('navstart', (event: any) => {
			this._routeRenderFunc = undefined;
			this.invalidate();
		});
	}

	/**
	 * Check the route
	 */
	@beforeRender()
	protected checkRoute(renderFunc: () => DNode, properties: any, children: any) {
		const { properties: { getProperties = () => {} }, _routeRenderFunc, _routerContext: { started, depth, matchedRoutes, routeParams } } = this;

		if (_routeRenderFunc === undefined) {
			this._routeRenderFunc = noopRender;
			if (started) {

				const { route, onEnter, onExit } = getProperties(this.toInject(), this.properties.properties);
				const routes = matchedRoutes.get(depth);
				if (routes) {
					const matched = routes[0] === route;

					if (matched) {
						const routeDetails = routeParams.get(route);

						if (!this._isVisible) {
							this._isVisible = true;
							onEnter(route, routeDetails.params);
						}
						this._routerContext.depth = routeDetails.depth++;
						routes.unshift();
						this._routeRenderFunc = renderFunc;
					}
					else if (this._isVisible) {
						onExit(route);
						this._isVisible = false;
					}
				}
			}
		}
		return this._routeRenderFunc;
	}
}
