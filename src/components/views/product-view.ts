import { Component } from '../base/component';
import { IProduct, Events } from '../../types';
import { ensureElement } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';

export class ProductView extends Component<HTMLElement> {
	private _title: HTMLElement;
	private _image: HTMLImageElement;
	private _text: HTMLElement;
	private _category: HTMLElement;
	private _price: HTMLElement;
	private _button: HTMLButtonElement;
	private _buttonText = 'В корзину';
	private _buttonRemoveText = 'Убрать';

	constructor(container: HTMLElement) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._image = ensureElement<HTMLImageElement>('.card__image', this.container);
		this._text = ensureElement<HTMLElement>('.card__text', this.container);
		this._category = ensureElement<HTMLElement>('.card__category', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', this.container);

		this._button.addEventListener('click', this.handleButtonClick.bind(this));
	}

	render(product: IProduct, inCart = false): void {
		this._title.textContent = product.title;
		this._image.src = CDN_URL + product.image;
		this._text.textContent = product.description;
		this._category.textContent = product.category;
		this._price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';

		this.setCategoryClass(product.category);

		this.setButtonState(inCart);

		this.container.dataset.productId = product.id;
	}

	private setCategoryClass(category: string): void {
		const categoryMap: Record<string, string> = {
			'софт-скил': 'card__category_soft',
			'хард-скил': 'card__category_hard',
			'другое': 'card__category_other',
			'дополнительное': 'card__category_additional',
			'кнопка': 'card__category_button'
		};

		Object.values(categoryMap).forEach(cls => {
			this._category.classList.remove(cls);
		});

		const categoryClass = categoryMap[category.toLowerCase()] || 'card__category_other';
		this._category.classList.add(categoryClass);
	}

	setButtonState(inCart: boolean): void {
		this._button.textContent = inCart ? this._buttonRemoveText : this._buttonText;
		this.container.dataset.inCart = inCart ? 'true' : 'false';
	}

	private handleButtonClick(): void {
		const productId = this.container.dataset.productId;
		const inCart = this.container.dataset.inCart === 'true';

		if (inCart) {
			this.emit('product:remove', { id: productId });
		} else {
			this.emit('product:add', { id: productId });
		}
	}
}