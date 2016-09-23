import createApp from 'dojo-app/createApp';
import createMemoryStore from 'dojo-stores/createMemoryStore';
import createRoute, { Route } from 'dojo-routing/createRoute';
import { Parameters } from 'dojo-routing/interfaces';
import createRouter from 'dojo-routing/createRouter';
import createHashHistory from 'dojo-routing/history/createHashHistory';

import createLayoutContainer from './widgets/common/createLayoutContainer';
import createCardItem from './widgets/app/createCardItem';
import createCardHeader from './widgets/app/createCardHeader';
import createNavbar from './widgets/navbar/createNavbar';
import createFooter from './widgets/footer/createFooter';

const router = createRouter();
router.observeHistory(createHashHistory(), {}, true);

// bootstrapping mock data
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
		},
		{
			id: 'card-5',
			name: 'Card 5',
			description: 'This is card 5, deal with it.',
			type: 'monster'
		},
		{
			id: 'card-6',
			name: 'Card 6',
			description: 'This is card 6, deal with it.',
			type: 'monster'
		},
		{
			id: 'card-7',
			name: 'Card 7',
			description: 'This is card 7, deal with it.',
			type: 'monster'
		},
		{
			id: 'card-8',
			name: 'Card 8',
			description: 'This is card 8, deal with it.',
			type: 'monster'
		}
	]
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
		},
		{
			id: 'home-page-monsters-header',
			classes: [ 'card-header' ],
			label: 'Monsters',
			buttonName: 'View All'
		},
		{
			id: 'home-page-monsters-cards',
			classes: [ 'cards' ]
		},
		{
			id: 'home-page-heroes-header',
			classes: [ 'card-header' ],
			label: 'Heroes',
			buttonName: 'View All'
		},
		{
			id: 'home-page-heroes-cards',
			classes: [ 'cards' ]
		},
		{
			id: 'home-page-monsters',
			children: [ 'home-page-monsters-header', 'home-page-monsters-cards' ],
			classes: [ 'card-row' ]
		},
		{
			id: 'home-page-heroes',
			children: [ 'home-page-heroes-header', 'home-page-heroes-cards' ],
			classes: [ 'card-row' ]
		},
		{
			id: 'home-page',
			children: [ 'home-page-monsters', 'home-page-heroes' ],
			classes: [ 'home-page' ]
		}
	]
});

cardsStore.observe().subscribe((options: any) => {
	// puts all the cards, always into the widget store.
	return Promise.all(Array.from(options.puts).map((item: any) => widgetStore.patch(
		{
			id: item.id,
			type: 'card-item',
			src: 'images/monster.png',
			name: item.name,
			description: item.description,
			classes: [ 'card' ]
		}
	)));
});

const homeRoute: Route<Parameters> = createRoute({
	exec (request) {
		return cardsStore.get().then((cards: any) => {
			const homePageMonsters = { id: 'home-page-monsters-cards', children: [cards.next().value.id, cards.next().value.id, cards.next().value.id, cards.next().value.id] };
			const homePageHeroes = { id: 'home-page-heroes-cards', children: [cards.next().value.id, cards.next().value.id, cards.next().value.id, cards.next().value.id] };
			return widgetStore.patch(homePageMonsters).patch(homePageHeroes).then(() => widgetStore.patch({ id: 'container', children: [ 'home-page' ] }));
		});
	}
});

router.append([homeRoute]);

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
			factory: createLayoutContainer
		},
		{
			id: 'footer',
			factory: createFooter
		},
		{
			id: 'home-page',
			factory: createLayoutContainer
		},
		{
			id: 'home-page-monsters-cards',
			factory: createLayoutContainer
		},
		{
			id: 'home-page-monsters-header',
			factory: createCardHeader
		},
		{
			id: 'home-page-heroes-cards',
			factory: createLayoutContainer
		},
		{
			id: 'home-page-heroes-header',
			factory: createCardHeader
		},
		{
			id: 'home-page-monsters',
			factory: createLayoutContainer
		},
		{
			id: 'home-page-heroes',
			factory: createLayoutContainer
		},
		{
			id: 'cards-page',
			factory: createLayoutContainer
		},
		{
			id: 'card-details',
			factory: createLayoutContainer
		}
	],
	customElements: [
		{
			name: 'card-item',
			factory: createCardItem
		}
	]
});

app.realize(document.body);
