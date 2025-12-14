// src/components/Views/SuccessView.ts
import { cloneTemplate } from '../../utils/dom';
import { IEvents } from '../base/Events';

export class SuccessView {
  private element: HTMLElement;
  private descriptionEl: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor() {
    this.element = cloneTemplate<HTMLElement>('success');
    this.descriptionEl = this.element.querySelector('.order-success__description')!;
    this.closeButton = this.element.querySelector('.order-success__close')!;

    // обработчик кнопки закрытия
    this.closeButton.addEventListener('click', () => {
      events.emit('success:close', {});
    });
  }

  /** Отрисовать сумму заказа */
  render(total: number): HTMLElement {
    this.descriptionEl.textContent = `Списано ${total} синапсов`;
    return this.element;
  }
}