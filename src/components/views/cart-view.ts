import { Component } from '../base/component';
import { ICartView, IProduct, Events } from '../../types';
import { ensureElement, cloneTemplate } from '../../utils/utils';

export class CartView extends Component<HTMLElement> implements ICartView {
	private _list: HTMLElement;
	private _total: HTMLElement;
	private _button: HTMLButtonElement;
	private _template: HTMLTemplateElement;
	private _emptyText = 'Корзина пуста';

	constructor(container: HTMLElement, template: HTMLTemplateElement) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
		this._template = template;

		this._button.addEventListener('click', this.handleClick.bind(this));
	}

	render(items: Map<string, IProduct>): void {
		this._list.innerHTML = '';
		const itemsArray = Array.from(items.values());

		if (itemsArray.length === 0) {
			const emptyMessage = document.createElement('p');
			emptyMessage.textContent = this._emptyText;
			this._list.append(emptyMessage);
			this.setDisabled(this._button, true);
		} else {
			itemsArray.forEach((item, index) => {
				const card = this.createCartItem(item, index + 1);
				this._list.append(card);
			});
			this.setDisabled(this._button, false);
		}

		this.updateTotal(this.calculateTotal(itemsArray));
	}

	updateTotal(total: number): void {
		this._total.textContent = `${total} синапсов`;
	}

	private calculateTotal(items: IProduct[]): number {
		return items.reduce((sum, item) => sum + (item.price || 0), 0);
	}

	private createCartItem(item: IProduct, index: number): HTMLElement {
		const cartItem = cloneTemplate<HTMLElement>(this._template);

		const indexElement = cartItem.querySelector('.basket__item-index');
		const title = cartItem.querySelector('.card__title');
		const price = cartItem.querySelector('.card__price');
		const deleteButton = cartItem.querySelector('.basket__item-delete');

		if (indexElement) indexElement.textContent = String(index);
		if (title) title.textContent = item.title;
		if (price) price.textContent = item.price ? `${item.price} синапсов` : 'Бесценно';

		if (deleteButton) {
			deleteButton.addEventListener('click', (e) => {
				e.stopPropagation();
				this.emit('cart:remove', { id: item.id });
			});
		}

		cartItem.dataset.id = item.id;

		return cartItem;
	}

	private handleClick(): void {
		this.emit(Events.OPEN_DELIVERY, {});
	}
}