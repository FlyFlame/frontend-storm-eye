import L from 'leaflet';

const SENTINEL_2_TILE_URL = 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2024_3857/default/g/{z}/{y}/{x}.jpg';
const SENTINEL_2_ATTRIBUTION = [
	'<a href="https://maps.eox.at" target="_blank" rel="noopener noreferrer">EOX</a>',
	'Contains modified <a href="https://dataspace.copernicus.eu/" target="_blank" rel="noopener noreferrer">Copernicus Sentinel data 2024</a>',
	'<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a>',
].join(' | ');

export class MapLayerSwitcherComponent {
	constructor(mapComponent) {
		if (!mapComponent || !mapComponent.map || !mapComponent.baseLayer) {
			throw new TypeError('A map component with a base layer is required.');
		}

		this.mapComponent = mapComponent;
		this.sentinel2Layer = L.tileLayer(SENTINEL_2_TILE_URL, {
			attribution: SENTINEL_2_ATTRIBUTION,
			maxZoom: mapComponent.map.getMaxZoom(),
			maxNativeZoom: 14,
		});
		this.control = L.control.layers({
			'OpenStreetMap': mapComponent.baseLayer,
			'Sentinel-2 cloudless (2024)': this.sentinel2Layer,
		}, null, {
			collapsed: false,
			position: 'topright',
		}).addTo(mapComponent.map);
	}

	destroy() {
		this.mapComponent.map.removeControl(this.control);
		this.mapComponent.map.removeLayer(this.sentinel2Layer);
	}
}
