import { Model } from '../base/model';
import { IProduct, Events } from '../../types';
import { ApiClient } from '../api-client';

export class AppState extends Model<{ products: IProduct[], currentProduct: IProduct | null }> {
	private api: ApiClient;

	constructor(api: ApiClient) {
		super({
			products: [],
			currentProduct: null
		});
		this.api = api;
	}

	async loadProducts(): Promise<void> {
		const response = await this.api.getProducts();
		this.set('products', response);
		this.emit(Events.LOAD_PRODUCTS, { products: response });
	}

	setCurrentProduct(product: IProduct): void {
		this.set('currentProduct', product);
		this.emit(Events.OPEN_PRODUCT, { product });
	}

	async loadProductById(id: string): Promise<void> {
		const product = await this.api.getProduct(id);
		this.setCurrentProduct(product);
	}

	get products(): IProduct[] {
		return this.get('products');
	}

	get currentProduct(): IProduct | null {
		return this.get('currentProduct');
	}
}