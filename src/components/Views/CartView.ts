// src/components/Views/CartView.ts
import { cloneTemplate } from '../../utils/dom';
import { events } from '../base/Events';

export interface CartItemData {
  id: string;
  title: string;
  price: number;
}

export class CartView {
  private element: HTMLElement;
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private orderButton: HTMLButtonElement;

  constructor() {
    this.element = cloneTemplate<HTMLElement>('basket');
    this.listEl = this.element.querySelector('.basket__list')!;
    this.totalEl = this.element.querySelector('.basket__price')!;
    this.orderButton = this.element.querySelector('.basket__button')!;

    this.orderButton.addEventListener('click', () => {
      events.emit('cart:order');
    });
  }

  /** Отрисовываем список товаров */
  render(items: CartItemData[]) {
    this.listEl.innerHTML = '';
    let total = 0;

    items.forEach((item, index) => {
      const li = cloneTemplate<HTMLLIElement>('card-basket');
      li.querySelector('.basket__item-index')!.textContent = String(index + 1);
      li.querySelector('.card__title')!.textContent = item.title;
      li.querySelector('.card__price')!.textContent = `${item.price} синапсов`;

      li.querySelector('.basket__item-delete')!
        .addEventListener('click', () => {
          events.emit('cart:remove', { index });
        });

      this.listEl.appendChild(li);
      total += item.price;
    });

    this.totalEl.textContent = `${total} синапсов`;
    this.orderButton.disabled = items.length === 0;
  }

  getElement(): HTMLElement {
    return this.element;
  }
}