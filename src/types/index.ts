export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number | null;
}

export interface ICart {
	items: Map<string, IProduct>;
	add(item: IProduct): void;
	remove(id: string): void;
	clear(): void;
	getTotal(): number;
}

export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IModal {
	content: HTMLElement;
	open(): void;
	close(): void;
}

export interface IView {
	render(data: unknown): void;
}

export interface ICartView extends IView {
	updateTotal(total: number): void;
}

export interface IOrderView extends IView {
	showSuccess(): void;
	showError(message: string): void;
}

export interface IEvents {
	on<T extends object>(event: string, handler: (data: T) => void): void;
	emit<T extends object>(event: string, data: T): void;
	off(event: string, handler: Function): void;
}

export interface IProductsResponse {
	total: number;
	items: IProduct[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IAPIClient {
	getProducts(): Promise<IProduct[]>;
	getProduct(id: string): Promise<IProduct>;
	createOrder(order: IOrder): Promise<IOrderResult>;
}

export enum Events {
	LOAD_PRODUCTS = 'catalog:changed',
	OPEN_PRODUCT = 'card:open',
	OPEN_BASKET = 'basket:open',
	VALIDATE_ORDER = 'formErrors:changed',
	OPEN_DELIVERY = 'order_delivery:open',
	FINISH_DELIVERY = 'delivery:submit',
	OPEN_CONTACTS = 'order_contacts:open',
	FINISH_CONTACTS = 'contacts:submit',
	PLACE_ORDER = 'order:post',
	SELECT_PAYMENT = 'payment:changed',
	INPUT_ADDRESS = 'delivery.address:change',
	INPUT_EMAIL = 'contacts.email:change',
	INPUT_PHONE = 'contacts.phone:change',
	OPEN_MODAL = 'modal:open',
	CLOSE_MODAL = 'modal:close',
}

export type TDeliveryForm = Pick<IOrder, 'payment' | 'address'>;
export type TContactsForm = Pick<IOrder, 'email' | 'phone'>;

export interface IFormErrors {
	payment?: string;
	address?: string;
	email?: string;
	phone?: string;
}