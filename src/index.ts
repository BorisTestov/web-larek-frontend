import './scss/styles.scss';

import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { AppState } from './components/models/app-state';
import { Cart } from './components/models/cart';
import { Order } from './components/models/order';

import { ApiClient } from './components/base/api-client';

import { ProductListView } from './components/views/product-list-view';
import { ProductView } from './components/views/product-view';
import { CartView } from './components/views/cart-view';
import { OrderView } from './components/views/order-view';
import { BasketCounter } from './components/views/basket-counter';
import { Modal } from './components/base/modal';

import { AppPresenter } from './components/presenters/app-presenter';
import { CartPresenter } from './components/presenters/cart-presenter';
import { OrderPresenter } from './components/presenters/order-presenter';

document.addEventListener('DOMContentLoaded', function() {
	const activeModals = document.querySelectorAll('.modal_active');
	activeModals.forEach(modal => {
		modal.classList.remove('modal_active');
	});
});

(async function() {
	const api = new ApiClient(API_URL);

	const appState = new AppState(api);
	const cart = new Cart();
	const order = new Order();

	const galleryContainer = ensureElement<HTMLElement>('.gallery');
	const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
	const modalContainer = ensureElement<HTMLElement>('#modal-container');

	const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
	const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
	const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
	const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
	const deliveryFormTemplate = ensureElement<HTMLTemplateElement>('#order');
	const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
	const successTemplate = ensureElement<HTMLTemplateElement>('#success');

	const modal = new Modal(modalContainer);
	const basketCounter = new BasketCounter(basketButton);

	const productListView = new ProductListView(galleryContainer, cardCatalogTemplate);
	const productView = new ProductView(cloneTemplate<HTMLElement>(cardPreviewTemplate));
	const cartView = new CartView(cloneTemplate<HTMLElement>(basketTemplate), cardBasketTemplate);
	const orderView = new OrderView(
		document.createElement('div'),
		deliveryFormTemplate,
		contactsFormTemplate,
		successTemplate
	);

	const appPresenter = new AppPresenter(
		appState,
		productListView,
		productView,
		modal,
		cart,
		basketCounter
	);

	const cartPresenter = new CartPresenter(
		cart,
		cartView,
		modal,
		basketCounter
	);

	const orderPresenter = new OrderPresenter(
		order,
		orderView,
		modal,
		api
	);

	cartPresenter.setOrderPresenter(orderPresenter);

	orderPresenter.events.on('order:completed', () => {
		cartPresenter.events.emit('order:completed', {});
	});

	try {
		await appPresenter.init();
		console.log('Приложение инициализировано');
	} catch (error) {
		console.error('Ошибка инициализации приложения:', error);
	}
})();