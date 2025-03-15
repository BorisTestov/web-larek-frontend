import { Component } from '../base/component';
import { IProduct, Events } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';

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

		if (title) title.textContent = product.title;
		if (image) image.src = CDN_URL + product.image;
		if (category) {
			category.textContent = product.category;
			this.setCategoryClass(category as HTMLElement, product.category);
		}
		if (price) price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';

		card.addEventListener('click', () => {
			this.emit(Events.OPEN_PRODUCT, { product });
		});

		return card;
	}

	private setCategoryClass(element: HTMLElement, category: string): void {
		const categoryMap: Record<string, string> = {
			'софт-скил': 'card__category_soft',
			'хард-скил': 'card__category_hard',
			'другое': 'card__category_other',
			'дополнительное': 'card__category_additional',
			'кнопка': 'card__category_button'
		};

		const categoryClass = categoryMap[category.toLowerCase()] || 'card__category_other';
		element.classList.add(categoryClass);
	}
}