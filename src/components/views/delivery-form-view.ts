import { Component } from '../base/component';
import { TDeliveryForm, IFormErrors, Events } from '../../types';
import { ensureElement } from '../../utils/utils';

export class DeliveryForm extends Component<HTMLFormElement> {
	private _cardButton: HTMLButtonElement;
	private _cashButton: HTMLButtonElement;
	private _addressInput: HTMLInputElement;
	private _submitButton: HTMLButtonElement;
	private _errors: HTMLElement;
	private _paymentSelected = false;
	private _addressFilled = false;

	constructor(container: HTMLFormElement) {
		super(container);

		this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
		this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
		this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
		this._submitButton = ensureElement<HTMLButtonElement>('.order__button', this.container);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this._cardButton.addEventListener('click', () => this.setPaymentMethod('card'));
		this._cashButton.addEventListener('click', () => this.setPaymentMethod('cash'));
		this._addressInput.addEventListener('input', this.handleAddressInput.bind(this));
		this.container.addEventListener('submit', this.handleSubmit.bind(this));

		this.checkFormValidity();
	}

	render(data: TDeliveryForm): void {
		if (data.payment) {
			this.setPaymentMethod(data.payment);
			this._paymentSelected = true;
		}

		if (data.address) {
			this._addressInput.value = data.address;
			this._addressFilled = data.address.trim() !== '';
		}

		this.checkFormValidity();
	}

	private setPaymentMethod(method: string): void {
		const activeClass = 'button_alt-active';

		this._cardButton.classList.remove(activeClass);
		this._cashButton.classList.remove(activeClass);

		if (method === 'card') {
			this.toggleClass(this._cardButton, activeClass);
			this._paymentSelected = true;
		} else if (method === 'cash') {
			this.toggleClass(this._cashButton, activeClass);
			this._paymentSelected = true;
		}

		this.emit(Events.SELECT_PAYMENT, { payment: method });
		this.checkFormValidity();
	}

	private handleAddressInput(): void {
		const addressValue = this._addressInput.value.trim();
		this._addressFilled = addressValue !== '';
		this.emit(Events.INPUT_ADDRESS, { address: addressValue });
		this.checkFormValidity();
	}

	private handleSubmit(event: Event): void {
		event.preventDefault();
		this.emit(Events.FINISH_DELIVERY, {});
	}

	private checkFormValidity(): void {
		const isValid = this._paymentSelected && this._addressFilled;
		this.setDisabled(this._submitButton, !isValid);
	}

	setValid(isValid: boolean, errors: IFormErrors = {}): void {
		this.setDisabled(this._submitButton, !isValid);
		this.showErrors(errors);
	}

	showErrors(errors: IFormErrors): void {
		this.setText(this._errors, '');

		if (errors.payment) {
			this._errors.textContent += errors.payment;
		}

		if (errors.address) {
			if (this._errors.textContent) {
				this._errors.textContent += ', ';
			}
			this._errors.textContent += errors.address;
		}
	}

	reset(): void {
		this.container.reset();
		this._cardButton.classList.remove('button_alt-active');
		this._cashButton.classList.remove('button_alt-active');
		this.setText(this._errors, '');
		this._paymentSelected = false;
		this._addressFilled = false;
		this.checkFormValidity();
	}
}