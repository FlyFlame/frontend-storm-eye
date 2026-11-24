import './button-component.css';

export class ButtonComponent {
	constructor({ label, onClick, className = '' } = {}) {
		if (!label) {
			throw new TypeError('A button requires a label.');
		}

		this.element = document.createElement('button');
		this.element.type = 'button';
		this.element.className = `btn-8 btn-8-colors ${className}`.trim();
		this.element.textContent = label;

		if (onClick) this.element.addEventListener('click', onClick);
	}
}