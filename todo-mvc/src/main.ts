import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import Route from '@dojo/routing/Route';
import TodoApp from './widgets/TodoApp';
import router from './routes';
import { Injector } from '@dojo/widget-core/Injector';
import { RouterInjector, createRouterContext } from './widgets/Route';
import { registry } from '@dojo/widget-core/d';

const root = document.querySelector('my-app') || undefined;

const Projector = ProjectorMixin(TodoApp);
const projector = new Projector();

registry.define('router', Injector(RouterInjector, createRouterContext(router)));

function registerScenes(routes: any[], parentRoute: any = router) {
	routes.forEach((routeDef) => {
		const route = new Route({
			path: routeDef.path,
			exec(request) {
				router.emit<any>({ type: 'route', path: routeDef.path, chunk: routeDef.path, request });
			}
		});
		parentRoute.append(route);
		if (routeDef.children) {
			registerScenes(routeDef.children, route);
		}
	});
}

const routes = [
	{
		path: 'foo',
		children: [
			{
				path: 'footer/{id}',
				children: [
					{
						path: 'bar'
					}
				]
			}
		]
	},
	{
		path: 'footer/{id}'
	}
];

registerScenes(routes);

// TODO find a better place for this
const filterRoute = new Route<any, any>({
	path: '/{filter}',

	exec(request) {
		const { filter } = request.params;
		projector.setProperties({ filter });
	}
});
router.append(filterRoute);

projector.append(root);
router.start();
