import { Presenter } from '../base/presenter';
import { AppState } from '../models/app-state';
import { ProductListView } from '../views/product-list-view';
import { ProductView } from '../views/product-view';
import { Modal } from '../views/modal';
import { BasketCounter } from '../views/basket-counter';
import { Events, IProduct } from '../../types';
import { Cart } from '../models/cart';

export class AppPresenter extends Presenter<AppState, ProductListView> {
	private _productView: ProductView;
	private _modal: Modal;
	private _cart: Cart;
	private _basketCounter: BasketCounter;

	constructor(
		model: AppState,
		view: ProductListView,
		productView: ProductView,
		modal: Modal,
		cart: Cart,
		basketCounter: BasketCounter
	) {
		super(model, view);
		this._productView = productView;
		this._modal = modal;
		this._cart = cart;
		this._basketCounter = basketCounter;
	}

	protected bindEvents(): void {
		if (this.model) {
			this.model.on(Events.LOAD_PRODUCTS, (data: { products: IProduct[] }) => {
				this.view.render(data.products);
			});
		}

		if (this.view) {
			this.view.on(Events.OPEN_PRODUCT, (data: { product: IProduct }) => {
				this.openProductModal(data.product);
			});
		}

		if (this._productView) {
			this._productView.on('product:add', (data: { id: string }) => {
				const product = this.model.products.find(p => p.id === data.id);
				if (product) {
					this._cart.add(product);
					this._productView.setButtonState(true);
					this._basketCounter.render(this._cart.getItemsCount());
				}
			});

			this._productView.on('product:remove', (data: { id: string }) => {
				this._cart.remove(data.id);
				this._productView.setButtonState(false);
				this._basketCounter.render(this._cart.getItemsCount());
			});
		}

		if (this._basketCounter) {
			this._basketCounter.render(0);
		}
	}

	private openProductModal(product: IProduct): void {
		const inCart = this._cart.hasItem(product.id);

		this._productView.render(product, inCart);

		this._modal.content = this._productView.container;

		this._modal.open();
	}

	async init(): Promise<void> {
		try {
			await this.model.loadProducts();
		} catch (error) {
			console.error('Ошибка загрузки товаров:', error);
		}
	}
}