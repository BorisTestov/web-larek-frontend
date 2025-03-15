import { Component } from '../base/component';
import { TDeliveryForm, IFormErrors, Events } from '../../types';
import { ensureElement } from '../../utils/utils';

export class DeliveryForm extends Component<HTMLFormElement> {
	private _cardButton: HTMLButtonElement;
	private _cashButton: HTMLButtonElement;
	private _addressInput: HTMLInputElement;
	private _submitButton: HTMLButtonElement;
	private _errors: HTMLElement;

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
	}

	render(data: TDeliveryForm): void {
		if (data.payment) {
			this.setPaymentMethod(data.payment);
		}

		if (data.address) {
			this._addressInput.value = data.address;
		}
	}

	private setPaymentMethod(method: string): void {
		const activeClass = 'button_alt-active';

		this._cardButton.classList.remove(activeClass);
		this._cashButton.classList.remove(activeClass);

		if (method === 'card') {
			this._cardButton.classList.add(activeClass);
		} else if (method === 'cash') {
			this._cashButton.classList.add(activeClass);
		}

		this.emit(Events.SELECT_PAYMENT, { payment: method });
	}

	private handleAddressInput(): void {
		this.emit(Events.INPUT_ADDRESS, { address: this._addressInput.value });
	}

	private handleSubmit(event: Event): void {
		event.preventDefault();
		this.emit(Events.FINISH_DELIVERY, {});
	}

	setValid(isValid: boolean, errors: IFormErrors = {}): void {
		this.setDisabled(this._submitButton, !isValid);
		this.showErrors(errors);
	}

	showErrors(errors: IFormErrors): void {
		this._errors.textContent = '';

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
		this._errors.textContent = '';
	}
}