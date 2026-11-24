import './analysis-page.css';
import { MapComponent } from '../../components/map.component/map-component.js';
import { MapLayerSwitcherComponent } from '../../components/map-layer-switcher.component/map-layer-switcher-component.js';
import { HeaderComponent } from '../../components/header.component/header-component.js';

new HeaderComponent('#site-header', { homeUrl: './index.html' });

const map = new MapComponent('#map', {
	center: [50.0755, 14.4378],
	zoom: 13,
	markers: [
		{
			lat: 50.0755,
			lng: 14.4378,
			title: 'Praha',
			popup: 'Centrum Prahy',
		},
	],
});
new MapLayerSwitcherComponent(map);

const startButton = document.querySelector('#polygon-start');
const finishButton = document.querySelector('#polygon-finish');
const cancelButton = document.querySelector('#polygon-cancel');
const copyButton = document.querySelector('#polygon-copy');
const wktField = document.querySelector('#polygon-wkt');
const status = document.querySelector('#polygon-status');

startButton.addEventListener('click', () => {
	map.startPolygonDrawing();
	wktField.value = '';
	copyButton.disabled = true;
	startButton.disabled = true;
	finishButton.disabled = false;
	cancelButton.disabled = false;
	status.textContent = 'Klikáním do mapy přidávej vrcholy. Až bude polygon hotový, klikni na „Dokončit polygon“.';
});

finishButton.addEventListener('click', () => {
	const wkt = map.finishPolygonDrawing();
	if (!wkt) {
		status.textContent = 'Polygon musí mít alespoň tři vrcholy.';
		return;
	}

	wktField.value = wkt;
	copyButton.disabled = false;
	startButton.disabled = false;
	finishButton.disabled = true;
	cancelButton.disabled = true;
	status.textContent = 'Polygon byl vytvořen. WKT souřadnice jsou připravené ke zkopírování.';
});

cancelButton.addEventListener('click', () => {
	map.cancelPolygonDrawing();
	startButton.disabled = false;
	finishButton.disabled = true;
	cancelButton.disabled = true;
	status.textContent = 'Kreslení polygonu bylo zrušeno.';
});

copyButton.addEventListener('click', async () => {
	try {
		await navigator.clipboard.writeText(wktField.value);
		status.textContent = 'WKT souřadnice byly zkopírovány do schránky.';
	} catch (error) {
		status.textContent = `Kopírování se nezdařilo. WKT můžeš zkopírovat ručně. ${error.message}`;
	}
});
