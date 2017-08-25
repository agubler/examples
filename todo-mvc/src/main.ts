import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { registerRouterInjector } from '@dojo/routing/RouterInjector';
import { registry } from '@dojo/widget-core/d';
import { BaseInjector, Injector } from '@dojo/widget-core/Injector';
import { TodoAppContainer } from './containers/TodoAppContainer';
import { Store } from './store/store';
import { getTodosProcess } from './processes/todoProcesses';
import { createSuccessCommandResponse } from './store/store';
import { add } from './store/operation';

const root = document.querySelector('my-app') || undefined;

const config = [
	{
		path: '{filter}',
		outlet: 'filter',
		defaultParams: {
			filter: 'all'
		},
		defaultRoute: true
	}
];

function initialState() {
	return createSuccessCommandResponse([
		add('/todos', []),
		add('/currentTodo', ''),
		add('/activeCount', 0),
		add('/completedCount', 0)
	], false);
}

const store = new Store([ initialState ], getTodosProcess);

registry.define('application-state', Injector(BaseInjector, store));

const router = registerRouterInjector(config);
const Projector = ProjectorMixin(TodoAppContainer);
const projector = new Projector();
projector.append(root);
router.start();
