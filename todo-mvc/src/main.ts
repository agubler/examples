import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import Route from '@dojo/routing/Route';
import TodoApp from './widgets/TodoApp';
import router from './routes';
import { Injector } from '@dojo/widget-core/Injector';
import { RouterInjector, createRouterContext, registerRoutes } from './widgets/Route';
import { registry } from '@dojo/widget-core/d';

const root = document.querySelector('my-app') || undefined;

const Projector = ProjectorMixin(TodoApp);
const projector = new Projector();

registry.define('router', Injector(RouterInjector, createRouterContext(router)));

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

registerRoutes(routes, router);

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
