import { ButtonComponent } from '../button.component/button-component.js';
import './header-component.css';

export class HeaderComponent {
	constructor(container, { homeUrl = '/' } = {}) {
		const target = typeof container === 'string'
			? document.querySelector(container)
			: container;

		if (!target) {
			throw new Error('Header container was not found.');
		}

		this.element = document.createElement('header');
		this.element.className = 'site-header';

		const homeButton = new ButtonComponent({
			label: 'Home',
			className: 'site-header__home',
			onClick: () => window.location.assign(homeUrl),
		});

		this.element.append(homeButton.element);
		target.replaceChildren(this.element);
	}
}