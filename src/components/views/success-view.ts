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
		this.setText(this._title, 'Заказ оформлен');
		this.setText(this._description, `Списано ${total} синапсов`);
		this.emit('order:completed', {});
	}

	private handleClick(): void {
		this.emit(Events.CLOSE_MODAL, {});
	}
}