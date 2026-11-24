import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map-component.css';

const DEFAULT_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export class MapComponent {
	constructor(container, {
		center = [50.0755, 14.4378],
		zoom = 13,
		minZoom = 2,
		maxZoom = 19,
		tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		attribution = DEFAULT_ATTRIBUTION,
		markers = [],
	} = {}) {
		this.container = typeof container === 'string'
			? document.querySelector(container)
			: container;

		if (!this.container) {
			throw new Error('Map container was not found.');
		}

		this.markers = new Set();
		this.map = L.map(this.container, { minZoom, maxZoom }).setView(center, zoom);
		this.baseLayer = L.tileLayer(tileUrl, { attribution, maxZoom }).addTo(this.map);
		this.polygon = null;
		this.draftLayer = null;
		this.polygonPoints = [];
		this.isDrawingPolygon = false;
		this.map.on('click', this.#handleMapClick, this);
		markers.forEach((marker) => this.addMarker(marker));
	}

	addMarker({ lat, lng, title, popup } = {}) {
		if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
			throw new TypeError('A marker requires numeric lat and lng coordinates.');
		}

		const marker = L.marker([lat, lng]).addTo(this.map);
		if (title) marker.bindTooltip(this.#textElement(title));
		if (popup) marker.bindPopup(this.#textElement(popup));
		this.markers.add(marker);
		return marker;
	}

	removeMarker(marker) {
		if (!this.markers.delete(marker)) return false;
		this.map.removeLayer(marker);
		return true;
	}

	clearMarkers() {
		this.markers.forEach((marker) => this.map.removeLayer(marker));
		this.markers.clear();
	}

	startPolygonDrawing() {
		this.cancelPolygonDrawing();
		this.clearPolygon();
		this.isDrawingPolygon = true;
		this.polygonPoints = [];
	}

	finishPolygonDrawing() {
		if (!this.isDrawingPolygon || this.polygonPoints.length < 3) return null;

		this.isDrawingPolygon = false;
		this.draftLayer.remove();
		this.draftLayer = null;
		this.polygon = L.polygon(this.polygonPoints, {
			color: '#176b3a',
			fillColor: '#2e9d5b',
			fillOpacity: 0.25,
		}).addTo(this.map);

		const ring = this.polygonPoints.map(({ lat, lng }) => `${lng.toFixed(6)} ${lat.toFixed(6)}`);
		ring.push(ring[0]);
		this.polygonPoints = [];
		return `POLYGON ((${ring.join(', ')}))`;
	}

	cancelPolygonDrawing() {
		this.isDrawingPolygon = false;
		this.polygonPoints = [];
		if (this.draftLayer) {
			this.draftLayer.remove();
			this.draftLayer = null;
		}
	}

	clearPolygon() {
		this.cancelPolygonDrawing();
		if (this.polygon) {
			this.polygon.remove();
			this.polygon = null;
		}
	}

	setView(center, zoom) {
		this.map.setView(center, zoom);
	}

	destroy() {
		this.clearMarkers();
		this.clearPolygon();
		this.map.remove();
	}

	#handleMapClick(event) {
		if (!this.isDrawingPolygon) return;

		this.polygonPoints.push(event.latlng);
		if (!this.draftLayer) this.draftLayer = L.layerGroup().addTo(this.map);
		this.draftLayer.clearLayers();

		if (this.polygonPoints.length >= 3) {
			L.polygon(this.polygonPoints, {
				color: '#176b3a',
				fillColor: '#2e9d5b',
				fillOpacity: 0.15,
			}).addTo(this.draftLayer);
		} else if (this.polygonPoints.length === 2) {
			L.polyline(this.polygonPoints, { color: '#176b3a', dashArray: '5 5' }).addTo(this.draftLayer);
		}

		this.polygonPoints.forEach((point) => {
			L.circleMarker(point, {
				radius: 4,
				color: '#fff',
				weight: 2,
				fillColor: '#176b3a',
				fillOpacity: 1,
			}).addTo(this.draftLayer);
		});
	}

	#textElement(text) {
		const element = document.createElement('span');
		element.textContent = text;
		return element;
	}
}