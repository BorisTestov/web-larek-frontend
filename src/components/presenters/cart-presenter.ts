import { Presenter } from '../base/presenter';
import { Cart } from '../models/cart';
import { CartView } from '../views/cart-view';
import { Modal } from '../base/modal';
import { BasketCounter } from '../views/basket-counter';
import { Events } from '../../types';
import { OrderPresenter } from './order-presenter';

export class CartPresenter extends Presenter<Cart, CartView> {
	private _modal: Modal;
	private _basketCounter: BasketCounter;
	private _orderPresenter: OrderPresenter | null = null;

	constructor(
		model: Cart,
		view: CartView,
		modal: Modal,
		basketCounter: BasketCounter
	) {
		super(model, view);
		this._modal = modal;
		this._basketCounter = basketCounter;
	}

	setOrderPresenter(orderPresenter: OrderPresenter): void {
		this._orderPresenter = orderPresenter;
	}

	protected bindEvents(): void {
		this._basketCounter.on(Events.OPEN_BASKET, () => {
			this.openCartModal();
		});

		this.model.on('items:changed', () => {
			this.updateView();
		});

		this.view.on('cart:remove', (data: { id: string }) => {
			this.model.remove(data.id);
			this._basketCounter.render(this.model.getItemsCount());
		});

		this.view.on(Events.OPEN_DELIVERY, () => {
			if (this._orderPresenter) {
				this._orderPresenter.setOrderItems(
					this.model.getItemIds(),
					this.model.getTotal()
				);
				this._orderPresenter.openDeliveryForm();
			}
		});

		this.events.on('order:completed', () => {
			this.model.clear();
			this._basketCounter.render(0);
		});
	}

	openCartModal(): void {
		this.updateView();

		this._modal.content = this.view.container;

		this._modal.open();
	}

	private updateView(): void {
		this.view.render(this.model.items);
	}
}