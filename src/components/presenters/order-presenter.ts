import { Presenter } from '../base/presenter';
import { Order } from '../models/order';
import { OrderView } from '../views/order-view';
import { Modal } from '../views/modal';
import { Events, IFormErrors, TDeliveryForm, TContactsForm } from '../../types';
import { DeliveryForm } from '../views/delivery-form-view';
import { ContactsForm } from '../views/contacts-form-view';
import { SuccessView } from '../views/success-view';
import { ApiClient } from '../api-client';

export class OrderPresenter extends Presenter<Order, OrderView> {
	private _modal: Modal;
	private _deliveryForm: DeliveryForm | null = null;
	private _contactsForm: ContactsForm | null = null;
	private _successView: SuccessView | null = null;
	private _api: ApiClient;

	constructor(
		model: Order,
		view: OrderView,
		modal: Modal,
		api: ApiClient
	) {
		super(model, view);
		this._modal = modal;
		this._api = api;
	}

	protected bindEvents(): void {
		this._modal.on(Events.CLOSE_MODAL, () => {
			this.model.reset();
		});

		this.model.on(Events.VALIDATE_ORDER, (errors: IFormErrors) => {
			this.handleFormValidation(errors);
		});

		this.events.on(Events.SELECT_PAYMENT, (data: { payment: string }) => {
			this.model.setPayment(data.payment);
		});

		this.events.on(Events.INPUT_ADDRESS, (data: { address: string }) => {
			this.model.setAddress(data.address);
		});

		this.events.on(Events.FINISH_DELIVERY, () => {
			if (this.model.validateDelivery()) {
				this.openContactsForm();
			}
		});

		this.events.on(Events.INPUT_EMAIL, (data: { email: string }) => {
			this.model.setEmail(data.email);
		});

		this.events.on(Events.INPUT_PHONE, (data: { phone: string }) => {
			this.model.setPhone(data.phone);
		});

		this.events.on(Events.FINISH_CONTACTS, () => {
			if (this.model.validateContacts()) {
				this.submitOrder();
			}
		});
	}

	setOrderItems(items: string[], total: number): void {
		this.model.setItems(items);
		this.model.setTotal(total);
	}

	openDeliveryForm(): void {
		const formElement = this.view.showDeliveryForm();
		this._deliveryForm = new DeliveryForm(formElement);

		this._deliveryForm.on(Events.SELECT_PAYMENT, (data) => {
			this.events.emit(Events.SELECT_PAYMENT, data);
		});

		this._deliveryForm.on(Events.INPUT_ADDRESS, (data) => {
			this.events.emit(Events.INPUT_ADDRESS, data);
		});

		this._deliveryForm.on(Events.FINISH_DELIVERY, () => {
			this.events.emit(Events.FINISH_DELIVERY, {});
		});

		const deliveryFormData = this.model.getDeliveryForm();
		this._deliveryForm.render(deliveryFormData);

		this._modal.content = this.view.container;
		this._modal.open();

		const validationResult = this.model.validateDelivery();

		if (deliveryFormData.payment && deliveryFormData.address && deliveryFormData.address.trim() !== '') {
			this._deliveryForm.setValid(true, {});
		}
	}

	openContactsForm(): void {
		const formElement = this.view.showContactsForm();
		this._contactsForm = new ContactsForm(formElement);

		this._contactsForm.on(Events.INPUT_EMAIL, (data) => {
			this.events.emit(Events.INPUT_EMAIL, data);
		});

		this._contactsForm.on(Events.INPUT_PHONE, (data) => {
			this.events.emit(Events.INPUT_PHONE, data);
		});

		this._contactsForm.on(Events.FINISH_CONTACTS, () => {
			const contactsData = this.model.getContactsForm();
			const emailFilled = contactsData.email && contactsData.email.trim() !== '';
			const phoneFilled = contactsData.phone && contactsData.phone.trim() !== '';

			if (emailFilled && phoneFilled) {
				this.events.emit(Events.FINISH_CONTACTS, {});
			} else {
				this._contactsForm.showErrors({
					email: !emailFilled ? 'Введите email' : '',
					phone: !phoneFilled ? 'Введите телефон' : ''
				});
			}
		});

		this._contactsForm.render(this.model.getContactsForm());
		this._modal.content = this.view.container;
		this._modal.open();

		this.model.validateContacts();
	}

	async submitOrder(): Promise<void> {
		try {
			const result = await this._api.createOrder(this.model.props);

			const successElement = this.view.showSuccess();
			this._successView = new SuccessView(successElement);

			this._successView.on(Events.CLOSE_MODAL, () => {
				this._modal.close();
			});

			this._successView.on('order:completed', () => {
				this.events.emit('order:completed', {});
			});

			this._successView.render(result.total);

			this._modal.content = this.view.container;
			this._modal.open();

			this.events.emit('order:completed', {});
		} catch (error) {
			console.error('Ошибка оформления заказа:', error);
			this.view.showError('Произошла ошибка при оформлении заказа');
		}
	}

	private handleFormValidation(errors: IFormErrors): void {
		if (this._deliveryForm) {
			const isValidDelivery = !errors.payment && !errors.address;

			const deliveryData = this.model.getDeliveryForm();
			const addressFilled = deliveryData.address && deliveryData.address.trim() !== '';
			const paymentSelected = !!deliveryData.payment;

			const isFormValid = isValidDelivery && addressFilled && paymentSelected;

			this._deliveryForm.setValid(isFormValid, {
				payment: errors.payment,
				address: errors.address
			});
		}

		if (this._contactsForm) {
			const isValidContacts = !errors.email && !errors.phone;

			const contactsData = this.model.getContactsForm();
			const emailFilled = contactsData.email && contactsData.email.trim() !== '';
			const phoneFilled = contactsData.phone && contactsData.phone.trim() !== '';

			const isFormValid = isValidContacts && emailFilled && phoneFilled;

			this._contactsForm.setValid(isFormValid, {
				email: errors.email,
				phone: errors.phone
			});

			if (emailFilled && phoneFilled) {
				this._contactsForm.setValid(true, errors);
			}
		}
	}

}