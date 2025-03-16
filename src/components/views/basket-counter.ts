import { Component } from '../base/component';
import { Events } from '../../types';

export class BasketCounter extends Component<HTMLButtonElement> {
	private _counter: HTMLElement;

	constructor(container: HTMLButtonElement) {
		super(container);
		this._counter = container.querySelector('.header__basket-counter') as HTMLElement;
		this.container.addEventListener('click', this.handleClick.bind(this));
	}

	render(count: number): void {
		this.setText(this._counter, count.toString());
	}

	private handleClick(): void {
		this.emit(Events.OPEN_BASKET, {});
	}
}