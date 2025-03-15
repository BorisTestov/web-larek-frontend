import { IEvents } from '../../types';
import { EventEmitter } from './events';

export abstract class Presenter<T extends IEvents, U extends IEvents> {
	protected readonly model: T;
	protected readonly view: U;
	events: EventEmitter;

	constructor(model: T, view: U) {
		this.model = model;
		this.view = view;
		this.events = new EventEmitter();

		setTimeout(() => {
			this.bindEvents();
		}, 0);
	}

	protected abstract bindEvents(): void;
}