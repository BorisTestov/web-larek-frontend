import { Model } from '../base/model';
import { IOrder, IFormErrors, TContactsForm, TDeliveryForm, Events } from '../../types';
import { EMAIL_REGEX, PHONE_REGEX } from '../../utils/constants';



export class Order extends Model<IOrder> {
	protected _formErrors: IFormErrors = {};

	constructor(data: Partial<IOrder> = {}) {
		super({
			payment: '',
			email: '',
			phone: '',
			address: '',
			total: 0,
			items: [],
			...data
		});
	}

	reset(): void {
		this.set('payment', '');
		this.set('email', '');
		this.set('phone', '');
		this.set('address', '');
    this._formErrors = {};
    this.trigger(Events.VALIDATE_ORDER, this._formErrors);
	}

	setPayment(value: string): void {
		this.set('payment', value);
		this.validateDelivery();
	}

	setAddress(value: string): void {
		this.set('address', value);
		this.validateDelivery();
	}

	setEmail(value: string): void {
		this.set('email', value);
		this.validateContacts();
	}

	setPhone(value: string): void {
		this.set('phone', value);
		this.validateContacts();
	}

	setItems(items: string[]): void {
		this.set('items', items);
	}

	setTotal(total: number): void {
		this.set('total', total);
	}

	validateDelivery(): boolean {
		const errors: IFormErrors = {};

		if (!this.get('payment')) {
			errors.payment = 'Выберите способ оплаты';
		}
		else {
			errors.payment = '';
		}

		if (!this.get('address') || this.get('address').trim() === '') {
			errors.address = 'Введите адрес доставки';
		}
		else {
      errors.address = '';
    }

		this._formErrors = {
			...this._formErrors,
			...errors
		};

		this.emit(Events.VALIDATE_ORDER, this._formErrors);

		const filteredErrors = Object.entries(errors)
      .filter(([key, value]) => value.trim()!== '')
      .reduce((acc, [key, value]) => ({...acc, [key]: value }), {});

    return Object.keys(filteredErrors).length === 0;
	}

	validateContacts(): boolean {
		const errors: IFormErrors = {};
		const email = this.get('email');
		const phone = this.get('phone');

		if (!email) {
			errors.email = 'Введите email';
		} else if (!EMAIL_REGEX.test(email)) {
			errors.email = 'Некорректный email';
		}
		else {
			errors.email = '';
		}

		if (!phone) {
			errors.phone = 'Введите телефон';
		} else if (!PHONE_REGEX.test(phone)) {
			errors.phone = 'Некорректный формат телефона';
		}
		else {
      errors.phone = '';
    }

		this._formErrors = {
			...this._formErrors,
			...errors
		};

		this.emit(Events.VALIDATE_ORDER, this._formErrors);



		const filteredErrors = Object.entries(errors)
			.filter(([key, value]) => value.trim()!== '')
			.reduce((acc, [key, value]) => ({...acc, [key]: value }), {});

		return Object.keys(filteredErrors).length === 0;
	}

	validateOrder(): boolean {
		return this.validateDelivery() && this.validateContacts();
	}

	getDeliveryForm(): TDeliveryForm {
		return {
			payment: this.get('payment'),
			address: this.get('address')
		};
	}

	getContactsForm(): TContactsForm {
		return {
			email: this.get('email'),
			phone: this.get('phone')
		};
	}

	get formErrors(): IFormErrors {
		return this._formErrors;
	}
}