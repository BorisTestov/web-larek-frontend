import { Model } from '../base/model';
import { ICart, IProduct, Events } from '../../types';

export class Cart extends Model<{ items: Map<string, IProduct> }> implements ICart {
	constructor() {
		super({
			items: new Map()
		});
	}

	add(item: IProduct): void {
		this._props.items.set(item.id, item);
		this.emitChanges('items', this._props.items);
		this.emit(Events.OPEN_BASKET, { items: this._props.items });
	}

	remove(id: string): void {
		this._props.items.delete(id);
		this.emitChanges('items', this._props.items);
	}

	clear(): void {
		this._props.items.clear();
		this.emitChanges('items', this._props.items);
	}

	getTotal(): number {
		return Array.from(this._props.items.values()).reduce(
			(total, item) => total + (item.price || 0),
			0
		);
	}

	getItemsCount(): number {
		return this._props.items.size;
	}

	getItemIds(): string[] {
		return Array.from(this._props.items.keys());
	}

	getItem(id: string): IProduct | undefined {
		return this._props.items.get(id);
	}

	hasItem(id: string): boolean {
		return this._props.items.has(id);
	}

	get items(): Map<string, IProduct> {
		return this._props.items;
	}
}