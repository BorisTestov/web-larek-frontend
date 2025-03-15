import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { Events } from '../../types';

export class SuccessView extends Component<HTMLElement> {
	private _title: HTMLElement;
	private _description: HTMLElement;
	private _closeButton: HTMLButtonElement;

	constructor(container: HTMLElement) {
		super(container);

		this._title = ensureElement<HTMLElement>('.order-success__title', this.container);
		this._description = ensureElement<HTMLElement>('.order-success__description', this.container);
		this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

		this._closeButton.addEventListener('click', this.handleClick.bind(this));
	}

	render(total: number): void {
		this._title.textContent = 'Заказ оформлен';
		this._description.textContent = `Списано ${total} синапсов`;
		this.emit('order:completed', {});
	}

	private handleClick(): void {
		this.emit(Events.CLOSE_MODAL, {});
	}
}