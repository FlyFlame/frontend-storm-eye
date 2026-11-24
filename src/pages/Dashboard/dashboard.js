import './dashboard.css';
import { HeaderComponent } from '../../components/header.component/header-component.js';

new HeaderComponent('#site-header', { homeUrl: './index.html' });

const slider = document.querySelector('[data-analysis-slider]');

if (slider) {
	const track = slider.querySelector('[data-slider-track]');
	const slides = [...slider.querySelectorAll('.analysis-slide')];
	const dots = [...slider.querySelectorAll('[data-slide-to]')];
	const status = slider.querySelector('[data-slider-status]');
	let currentSlide = 0;
	let pointerStartX = null;

	const showSlide = (index) => {
		currentSlide = (index + slides.length) % slides.length;
		track.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;

		slides.forEach((slide, slideIndex) => {
			slide.setAttribute('aria-hidden', String(slideIndex !== currentSlide));
		});
		dots.forEach((dot, dotIndex) => {
			const isActive = dotIndex === currentSlide;
			dot.classList.toggle('is-active', isActive);
			dot.setAttribute('aria-pressed', String(isActive));
		});
		status.textContent = `Zobrazena analýza ${currentSlide + 1} z ${slides.length}.`;
	};

	slider.querySelector('[data-slider-previous]').addEventListener('click', () => {
		showSlide(currentSlide - 1);
	});
	slider.querySelector('[data-slider-next]').addEventListener('click', () => {
		showSlide(currentSlide + 1);
	});
	dots.forEach((dot) => {
		dot.addEventListener('click', () => {
			showSlide(Number(dot.dataset.slideTo));
		});
	});
	slider.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowLeft') showSlide(currentSlide - 1);
		if (event.key === 'ArrowRight') showSlide(currentSlide + 1);
	});
	slider.addEventListener('pointerdown', (event) => {
		if (event.target.closest('button')) return;
		pointerStartX = event.clientX;
		slider.setPointerCapture(event.pointerId);
	});
	slider.addEventListener('pointerup', (event) => {
		if (pointerStartX === null) return;
		const distance = event.clientX - pointerStartX;
		pointerStartX = null;
		if (Math.abs(distance) < 40) return;
		showSlide(currentSlide + (distance < 0 ? 1 : -1));
	});
	slider.addEventListener('pointercancel', () => {
		pointerStartX = null;
	});
}