import createApp from 'dojo-app/createApp';
import createMemoryStore from 'dojo-stores/createMemoryStore';
import createWidget from 'dojo-widgets/createWidget';

import createNavbar from './widgets/navbar/createNavbar';

let text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis dolor euismod, consequat nisl in, condimentum odio. Vivamus sit amet ipsum volutpat, auctor risus sit amet, consequat libero. Etiam quis suscipit ipsum, sit amet porta lectus. In sollicitudin orci quis tempus bibendum. Nam non ex in est cursus elementum. Praesent imperdiet ante eget leo varius porta. Quisque mollis ipsum eu augue efficitur dignissim. Sed a fermentum metus. In pretium nisi odio, eu aliquam purus interdum eget. Nulla ut mi at felis facilisis porttitor facilisis quis massa. Integer egestas neque sem, non ultrices ex blandit sit amet. Sed eu lectus urna.';

for (let i = 0; i < 5; i++) {
	text += text;
}

const widgetStore = createMemoryStore({
	data: [
		{
			id: 'navbar',
			classes: [ 'navbar' ]
		},
		{
			id: 'container',
			classes: [ 'content' ],
			label: text
		}
	]
});

const app = createApp({ defaultWidgetStore: widgetStore });

app.loadDefinition({
	widgets: [
		{
			id: 'navbar',
			factory: createNavbar
		},
		{
			id: 'container',
			factory: createWidget
		}
	]
});

app
	.realize(document.body)
	.catch((err) => {
		/* Report any realization errors */
		console.error(err);
	});
