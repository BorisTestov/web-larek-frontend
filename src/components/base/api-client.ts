import { Api } from './api';
import { IAPIClient, IOrder, IOrderResult, IProduct, IProductsResponse } from '../../types';

export class ApiClient extends Api implements IAPIClient {
	constructor(baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
	}

	getProducts(): Promise<IProductsResponse> {
		return this.get('/product').then((data) => data as IProductsResponse);
	}

	getProduct(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((data) => data as IProduct);
	}

	createOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data) => data as IOrderResult);
	}
}