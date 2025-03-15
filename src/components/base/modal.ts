import { Component } from './component';
import { IModal, Events } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<HTMLElement> implements IModal {
	protected _content: HTMLElement;
	protected _closeButton: HTMLButtonElement;
	protected _activeClass = 'modal_active';

	constructor(container: HTMLElement, content?: HTMLElement) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
		this._content = ensureElement<HTMLElement>('.modal__content', this.container);

		if (content) {
			this.content = content;
		}

		this._closeButton.addEventListener('click', () => {
			this.close();
		});

		this.container.addEventListener('click', (event) => {
			if (event.target === this.container) {
				this.close();
			}
		});
	}

	set content(value: HTMLElement) {
		this._content.innerHTML = '';
		this._content.appendChild(value);
	}

	get content(): HTMLElement {
		return this._content;
	}

	open(): void {
		this.toggleClass(this.container, this._activeClass, true);
		this.emit(Events.OPEN_MODAL, { modal: this });
		document.body.classList.add('page__wrapper_locked');
	}

	close(): void {
		this.toggleClass(this.container, this._activeClass, false);
		this.emit(Events.CLOSE_MODAL, { modal: this });
		document.body.classList.remove('page__wrapper_locked');
	}

	render(data?: unknown): void {
		if (data instanceof HTMLElement) {
			this.content = data;
		}
	}
}