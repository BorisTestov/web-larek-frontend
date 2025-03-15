import { EventEmitter } from './events';

export abstract class Model<T extends Record<string, any>> extends EventEmitter {
	protected _props: T;

	constructor(data: Partial<T> = {}) {
		super();
		this._props = data as T;
	}

	get<K extends keyof T>(key: K): T[K] {
		return this._props[key];
	}

	set<K extends keyof T>(key: K, value: T[K]): void {
		this._props[key] = value;
		this.emitChanges(key.toString(), value);
	}

	emitChanges<K extends keyof T>(key: string, value: T[K]): void {
		this.emit(`${key}:changed`, { key, value });
	}

	update(data: Partial<T>): void {
		Object.assign(this._props, data);
		this.emit('model:updated', this._props);
	}

	get props(): T {
		return this._props;
	}
}