import { Api, ApiListResponse } from './base/api';
import { IAPIClient, IOrder, IOrderResult, IProduct, IProductsResponse } from '../types';
import { CDN_URL } from '../utils/constants';

export class ApiClient extends Api implements IAPIClient {
	constructor(baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
	}

	getProducts(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: CDN_URL + item.image
			}))
		);
	}

	getProduct(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((data: IProduct) => data);
	}

	createOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}