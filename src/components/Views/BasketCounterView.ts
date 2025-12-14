// src/components/Views/BasketCounterView.ts
export class BasketCounterView {
  private element: HTMLElement;

  constructor(selector: string = '.header__basket-counter') {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) {
      throw new Error(`Элемент счётчика корзины не найден: ${selector}`);
    }
    this.element = el;
  }

  update(count: number) {
    this.element.textContent = String(count);
    this.element.style.display = 'flex';
  }
}