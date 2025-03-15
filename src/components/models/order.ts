import { Model } from '../base/model';
import { IOrder, IFormErrors, TContactsForm, TDeliveryForm, Events } from '../../types';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

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

		if (!this.get('address')) {
			errors.address = 'Введите адрес доставки';
		}

		this._formErrors = {
			...this._formErrors,
			...errors
		};

		// Генерируем событие с ошибками валидации
		this.emit(Events.VALIDATE_ORDER, this._formErrors);

		// Проверяем наличие ошибок
		return Object.keys(errors).length === 0;
	}

	validateContacts(): boolean {
		const errors: IFormErrors = {};

		if (!this.get('email')) {
			errors.email = 'Введите email';
		} else if (!EMAIL_REGEX.test(this.get('email'))) {
			errors.email = 'Некорректный email';
		}

		if (!this.get('phone')) {
			errors.phone = 'Введите телефон';
		} else if (!PHONE_REGEX.test(this.get('phone'))) {
			errors.phone = 'Некорректный формат телефона';
		}

		this._formErrors = {
			...this._formErrors,
			...errors
		};

		this.emit(Events.VALIDATE_ORDER, this._formErrors);

		return Object.keys(errors).length === 0;
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