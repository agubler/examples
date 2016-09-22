import createApp from 'dojo-app/createApp';
import createMemoryStore from 'dojo-stores/createMemoryStore';
import createRoute, { Route } from 'dojo-routing/createRoute';
import { Parameters } from 'dojo-routing/interfaces';
import createRouter from 'dojo-routing/createRouter';
import createHashHistory from 'dojo-routing/history/createHashHistory';
import createPanel from 'dojo-widgets/createPanel';
import createLink from './widgets/common/createLink';

import createNavbar from './widgets/navbar/createNavbar';
import createFooter from './widgets/footer/createFooter';

const router = createRouter();
router.observeHistory(createHashHistory(), {}, true);

const cardsStore = createMemoryStore<any>({
	data: [
		{
			id: 'card-1',
			name: 'Card 1',
			description: 'This is card 1, deal with it.',
			type: 'monster'
		},
		{
			id: 'card-2',
			name: 'Card 2',
			description: 'This is card 2, deal with it.',
			type: 'monster'
		},
		{
			id: 'card-3',
			name: 'Card 3',
			description: 'This is card 3, deal with it.',
			type: 'monster'
		},
		{
			id: 'card-4',
			name: 'Card 4',
			description: 'This is card 4, deal with it.',
			type: 'monster'
		}
	]
});

cardsStore.observe().subscribe((options: any) => {
	// puts all the cards, always into the widget store.
	return Promise.all(Array.from(options.puts).map((item: any) => widgetStore.patch({id: item.id, type: 'monster-card', label: item.name, href: '#cards/' + item.id })));
});

const widgetStore = createMemoryStore<any>({
	data: [
		{
			id: 'navbar',
			classes: [ 'navbar' ]
		},
		{
			id: 'container',
			classes: [ 'content' ]
		},
		{
			id: 'footer',
			classes: [ 'footer' ]
		}
	]
});

const homeRoute: Route<Parameters> = createRoute({
	exec (request) {
		return cardsStore.get().then((cards: any) => {
			const homePage = { id: 'home-page', children: [cards.next().value.id, cards.next().value.id] };
			return widgetStore.patch(homePage).patch({ id: 'container', children: [ 'home-page' ] });
		});
	}
});

const cardsRoute: Route<Parameters> = createRoute({
	path: 'cards',
	exec (request) {
		return cardsStore.get().then((cards: any) => {
			const children = Array.from(cards).map((card: any) => card.id);
			const cardsPage = { id: 'cards-page', children };
			return widgetStore.patch(cardsPage).patch({ id: 'container', children: [ 'cards-page' ] });
		});
	}
});

const cardDetailRoute: Route<Parameters> = createRoute({
	path: 'cards/{id}',
	exec (request: any) {
		const cardDetailsPage = { id: 'card-details', children: [request.params['id']] };
		widgetStore.patch(cardDetailsPage).patch({ id: 'container', children: [ 'card-details' ] });
	}
});

router.append([homeRoute, cardsRoute, cardDetailRoute]);

const app = createApp({ defaultWidgetStore: widgetStore });

app.registerStore('cards-store', cardsStore);

app.loadDefinition({
	widgets: [
		{
			id: 'navbar',
			factory: createNavbar
		},
		{
			id: 'container',
			factory: createPanel
		},
		{
			id: 'footer',
			factory: createFooter
		},
		{
			id: 'home-page',
			factory: createPanel
		},
		{
			id: 'cards-page',
			factory: createPanel
		},
		{
			id: 'card-details',
			factory: createPanel
		}
	],
	customElements: [
		{
			name: 'monster-card',
			factory: createLink
		}
	]
});

app.realize(document.body);
