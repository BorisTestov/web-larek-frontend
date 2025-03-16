import { Component } from '../base/component';
import { TContactsForm, IFormErrors, Events } from '../../types';
import { ensureElement } from '../../utils/utils';
import { EMAIL_REGEX, PHONE_REGEX } from '../../utils/constants';

export class ContactsForm extends Component<HTMLFormElement> {
	private _emailInput: HTMLInputElement;
	private _phoneInput: HTMLInputElement;
	private _submitButton: HTMLButtonElement;
	private _errors: HTMLElement;
	private _emailValid = false;
	private _phoneValid = false;

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
			this.handleEmailInput();
		}

		if (data.phone) {
			this._phoneInput.value = data.phone;
			this.handlePhoneInput();
		}
	}

	private handleEmailInput(): void {
		const email = this._emailInput.value.trim();
		this._emailValid = EMAIL_REGEX.test(email);

		if (email && !this._emailValid) {
			this._emailInput.classList.add('invalid');
		} else {
			this._emailInput.classList.remove('invalid');
		}

		this.emit(Events.INPUT_EMAIL, { email });
		this.updateButtonState();
	}

	private handlePhoneInput(): void {
		const phone = this._phoneInput.value.trim();
		this._phoneValid = PHONE_REGEX.test(phone);

		if (phone && !this._phoneValid) {
			this._phoneInput.classList.add('invalid');
		} else {
			this._phoneInput.classList.remove('invalid');
		}

		this.emit(Events.INPUT_PHONE, { phone });
		this.updateButtonState();
	}

	private updateButtonState(): void {
		const emailFilled = this._emailInput.value.trim() !== '';
		const phoneFilled = this._phoneInput.value.trim() !== '';

		const isValid = emailFilled && phoneFilled;

		this.setDisabled(this._submitButton, !isValid);
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
		this.setText(this._errors, '');

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
		this.setText(this._errors, '');
		this._emailValid = false;
		this._phoneValid = false;
		this.updateButtonState();
	}
}