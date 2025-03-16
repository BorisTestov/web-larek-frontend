import { Component } from '../base/component';
import { IProduct, Events } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { CATEGORY_MAP, CDN_URL } from '../../utils/constants';

export class ProductListView extends Component<HTMLElement> {
	private _template: HTMLTemplateElement;

	constructor(container: HTMLElement, template: HTMLTemplateElement) {
		super(container);
		this._template = template;
	}

	render(products: IProduct[]): void {
		this.container.innerHTML = '';

		products.forEach(product => {
			const card = this.createCard(product);
			this.container.append(card);
		});
	}

	private createCard(product: IProduct): HTMLElement {
		const card = cloneTemplate<HTMLElement>(this._template);

		const title = card.querySelector('.card__title');
		const image = card.querySelector('.card__image') as HTMLImageElement;
		const category = card.querySelector('.card__category');
		const price = card.querySelector('.card__price');

		if (title) this.setText(title as HTMLElement, product.title);
		if (image) image.src = product.image;
		if (category) {
			this.setText(category as HTMLElement, product.category);
			this.setCategoryClass(category as HTMLElement, product.category);
		}
		if (price) this.setText(price as HTMLElement, product.price ? `${product.price} синапсов` : 'Бесценно');

		card.addEventListener('click', () => {
			this.emit(Events.OPEN_PRODUCT, { product });
		});

		return card;
	}

	private setCategoryClass(element: HTMLElement, category: string): void {
		const categoryClass = CATEGORY_MAP[category.toLowerCase()] || 'card__category_other';
		element.classList.add(categoryClass);
	}
}