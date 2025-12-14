// src/components/Views/ProductPreviewView.ts
import { cloneTemplate } from '../../utils/dom';
import { categoryMap } from '../../utils/constants';
import { IProduct } from '../../types/index';
import { resolveImagePath } from '../../utils/utils';
import { events } from '../base/Events';

export class ProductPreviewView {
  private element: HTMLElement;
  private titleEl: HTMLElement;
  private descriptionEl: HTMLElement;
  private priceEl: HTMLElement;
  private categoryEl: HTMLElement;
  private imageEl: HTMLImageElement;
  private buttonEl: HTMLButtonElement;

  // текущий товар и функция-проверка «товар в корзине?»
  private currentProduct: IProduct | null = null;
  private checkInCart: ((id: string) => boolean) | null = null;

  constructor() {
    this.element = cloneTemplate<HTMLElement>('card-preview');
    this.titleEl = this.element.querySelector('.card__title')!;
    this.descriptionEl = this.element.querySelector('.card__text')!;
    this.priceEl = this.element.querySelector('.card__price')!;
    this.categoryEl = this.element.querySelector('.card__category')!;
    this.imageEl = this.element.querySelector('.card__image')!;
    this.buttonEl = this.element.querySelector('.card__button')!;

    // когда корзина меняется — обновляем кнопку в открытой карточке
  events.on('cart:changed', () => {
      if (this.currentProduct && this.checkInCart) {
        const inCart = this.checkInCart(this.currentProduct.id);
        this.updateButton(this.currentProduct, inCart);
      }
    });
  }

  /** Даст вьюшке способ узнать «в корзине ли товар» */
  public setCartChecker(fn: (id: string) => boolean) {
    this.checkInCart = fn;
  }

  /** Рендер карточки. inCart — текущее состояние для кнопки */
  render(product: IProduct, inCart = false): HTMLElement {
    this.currentProduct = product;

    // Текстовые поля
    this.titleEl.textContent = product.title;
    this.descriptionEl.textContent = product.description || '';

    // Цена
    this.priceEl.textContent =
      product.price === null ? 'Бесценно' : `${product.price} синапсов`;

    // Категория + модификатор
    const entry = Object.values(categoryMap).find((c) => c.mod === product.category);
    this.categoryEl.className = `card__category card__category_${product.category}`;
    this.categoryEl.textContent = entry?.label || product.category;

    // Картинка
    this.imageEl.src = resolveImagePath(product.image);
    this.imageEl.alt = product.title;

    // Кнопка (зависит от inCart и цены)
   this.updateButton(product, inCart);

    return this.element;
  }

  getElement(): HTMLElement {
    return this.element;
  }

  /** Обновляет текст/состояние/обработчик кнопки */
  private updateButton(product: IProduct, inCart: boolean) {
  if (product.price === null) {
    this.priceEl.textContent = 'Бесценно';
    this.buttonEl.disabled = true;
    this.buttonEl.textContent = 'Недоступно';
    this.buttonEl.onclick = null;
  } else {
    this.priceEl.textContent = `${product.price} синапсов`;
    this.buttonEl.disabled = false;
    this.buttonEl.onclick = null;

    if (inCart) {
      this.buttonEl.textContent = 'Удалить из корзины';
      this.buttonEl.onclick = () => {
        events.emit('cart:remove-by-id', { id: product.id });
      };
    } else {
      this.buttonEl.textContent = 'Купить';
      this.buttonEl.onclick = () => {
        events.emit('cart:add', product);
      };
    }
  }}
}