import { EventEmitter } from './events';
import { ensureElement } from '../../utils/utils';

export abstract class Component<T extends HTMLElement> extends EventEmitter {
	readonly container: T;

	constructor(container: T | string) {
		super();
		this.container = ensureElement<T>(container);
	}

	toggleClass(element: HTMLElement, className: string, force?: boolean): void {
		element.classList.toggle(className, force);
	}

	setText(element: HTMLElement | null, text: string): void {
		if (element) {
			element.textContent = text;
		}
	}

	setHTML(element: HTMLElement | null, html: string): void {
		if (element) {
			element.innerHTML = html;
		}
	}

	setDisabled(element: HTMLElement, state: boolean): void {
		if (element) {
			if (state) {
				element.setAttribute('disabled', 'disabled');
			} else {
				element.removeAttribute('disabled');
			}
		}
	}

	hide(): void {
		this.container.style.display = 'none';
	}

	show(): void {
		this.container.style.display = '';
	}

	setStatus(status: string | null): void {
		if (status) {
			this.container.dataset.status = status;
		} else {
			delete this.container.dataset.status;
		}
	}

	abstract render(data?: unknown): void;
}