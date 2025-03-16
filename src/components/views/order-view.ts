import { Component } from '../base/component';
import { IOrderView, IOrder, Events } from '../../types';
import { ensureElement, cloneTemplate } from '../../utils/utils';

export class OrderView extends Component<HTMLElement> implements IOrderView {
	private _deliveryTemplate: HTMLTemplateElement;
	private _contactsTemplate: HTMLTemplateElement;
	private _successTemplate: HTMLTemplateElement;

	constructor(
		container: HTMLElement,
		deliveryTemplate: HTMLTemplateElement,
		contactsTemplate: HTMLTemplateElement,
		successTemplate: HTMLTemplateElement
	) {
		super(container);

		this._deliveryTemplate = deliveryTemplate;
		this._contactsTemplate = contactsTemplate;
		this._successTemplate = successTemplate;
	}

	render(order: IOrder): void {
		if (!order.payment || !order.address) {
			const form = this.showDeliveryForm();
			const deliveryData = {
				payment: order.payment,
				address: order.address
			};

			const addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;
			if (addressInput && order.address) {
				addressInput.value = order.address;
			}

			if (order.payment) {
				const paymentButtons = form.querySelectorAll('button[type="button"]');
				paymentButtons.forEach(button => {
					const buttonElement = button as HTMLButtonElement;
					if (buttonElement.name === order.payment) {
						this.toggleClass(buttonElement, 'button_alt-active');
					}
				});
			}
		} else if (!order.email || !order.phone) {
			const form = this.showContactsForm();

			const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
			const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;

			if (emailInput && order.email) {
				emailInput.value = order.email;
			}

			if (phoneInput && order.phone) {
				phoneInput.value = order.phone;
			}
		} else if (order.items.length > 0) {
			const successView = this.showSuccess();

			const description = successView.querySelector('.order-success__description');
			if (description) {
				this.setText(description as HTMLElement, `Списано ${order.total} синапсов`);
			}
		}
	}

	showDeliveryForm(): HTMLFormElement {
		const form = cloneTemplate<HTMLFormElement>(this._deliveryTemplate);
		this.clear();
		this.container.append(form);
		return form;
	}

	showContactsForm(): HTMLFormElement {
		const form = cloneTemplate<HTMLFormElement>(this._contactsTemplate);
		this.clear();
		this.container.append(form);
		return form;
	}

	showSuccess(): HTMLElement {
		const success = cloneTemplate<HTMLElement>(this._successTemplate);
		this.clear();
		this.container.append(success);
		return success;
	}

	showError(message: string): void {
		const errorElement = document.createElement('div');
		this.toggleClass(errorElement, 'order__error');
		this.setText(errorElement as HTMLElement, message);

		this.clear();
		this.container.append(errorElement);
	}

	private clear(): void {
		this.container.innerHTML = '';
	}
}