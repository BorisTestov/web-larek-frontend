import { Component } from '../base/component';
import { TContactsForm, IFormErrors, Events } from '../../types';
import { ensureElement } from '../../utils/utils';

export class ContactsForm extends Component<HTMLFormElement> {
	private _emailInput: HTMLInputElement;
	private _phoneInput: HTMLInputElement;
	private _submitButton: HTMLButtonElement;
	private _errors: HTMLElement;

	constructor(container: HTMLFormElement) {
		super(container);

		this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
		this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
		this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this._emailInput.addEventListener('input', this.handleEmailInput.bind(this));
		this._phoneInput.addEventListener('input', this.handlePhoneInput.bind(this));
		this.container.addEventListener('submit', this.handleSubmit.bind(this));
	}

	render(data: TContactsForm): void {
		if (data.email) {
			this._emailInput.value = data.email;
		}

		if (data.phone) {
			this._phoneInput.value = data.phone;
		}
	}

	private handleEmailInput(): void {
		this.emit(Events.INPUT_EMAIL, { email: this._emailInput.value });
	}

	private handlePhoneInput(): void {
		this.emit(Events.INPUT_PHONE, { phone: this._phoneInput.value });
	}

	private handleSubmit(event: Event): void {
		event.preventDefault();
		this.emit(Events.FINISH_CONTACTS, {});
	}

	setValid(isValid: boolean, errors: IFormErrors = {}): void {
		this.setDisabled(this._submitButton, !isValid);
		this.showErrors(errors);
	}

	showErrors(errors: IFormErrors): void {
		this._errors.textContent = '';

		if (errors.email) {
			this._errors.textContent += errors.email;
		}

		if (errors.phone) {
			if (this._errors.textContent) {
				this._errors.textContent += ', ';
			}
			this._errors.textContent += errors.phone;
		}
	}

	reset(): void {
		this.container.reset();
		this._errors.textContent = '';
	}
}