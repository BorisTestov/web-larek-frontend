import { Model } from '../base/model';
import { IProduct } from '../../types';

export class Product extends Model<IProduct> {
	constructor(data: IProduct) {
		super(data);
	}

	get id(): string {
		return this.get('id');
	}

	get title(): string {
		return this.get('title');
	}

	get description(): string {
		return this.get('description');
	}

	get image(): string {
		return this.get('image');
	}

	get category(): string {
		return this.get('category');
	}

	get price(): number | null {
		return this.get('price');
	}
}