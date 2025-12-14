// src/components/Views/OrderFormView.ts
import { cloneTemplate } from '../../utils/dom';
import { IBuyer } from '../../types';
import { events } from '../base/Events';

type Payment = IBuyer['payment']; // 'card' | 'cash'

/**
 * Форма шага 1 "Способ оплаты + адрес".
 * События:
 *  - 'order:next'  payload: { payment: 'card'|'cash', address: string }
 */
export class OrderFormView {
  private element: HTMLFormElement;
  private btnCard: HTMLButtonElement;
  private btnCash: HTMLButtonElement;
  private addressInput: HTMLInputElement;
  private submitBtn: HTMLButtonElement;
  private errorEl: HTMLElement;

  private state: { payment?: Payment; address: string } = { address: '' };

  constructor(initial?: Partial<IBuyer>) {
    this.element = cloneTemplate<HTMLFormElement>('order');

    this.btnCard = this.element.querySelector<HTMLButtonElement>('button[name="card"]')!;
    this.btnCash = this.element.querySelector<HTMLButtonElement>('button[name="cash"]')!;
    this.addressInput = this.element.querySelector<HTMLInputElement>('input[name="address"]')!;
    this.submitBtn = this.element.querySelector<HTMLButtonElement>('.order__button')!;
    this.errorEl = this.element.querySelector<HTMLElement>('.form__errors')!;

    // префилл из initial
    if (initial?.payment) this.state.payment = initial.payment as Payment;
    if (initial?.address) this.state.address = initial.address;

    this.syncFromStateToView();

    // подписки
    this.btnCard.addEventListener('click', () => this.setPayment('card'));
    this.btnCash.addEventListener('click', () => this.setPayment('cash'));
    this.addressInput.addEventListener('input', () => {
      this.state.address = this.addressInput.value.trim();
      this.validateAndToggle();
    });

    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validateAndToggle()) {
        events.emit<{ payment: Payment; address: string }>('order:next', {
          payment: this.state.payment!,
          address: this.state.address,
        });
      }
    });
  }

  /** Вернуть разметку формы */
  getElement(): HTMLElement {
    return this.element;
  }

  private setPayment(payment: Payment) {
    this.state.payment = payment;
    this.syncPaymentButtons();
    this.validateAndToggle();
  }

  private syncFromStateToView() {
    this.addressInput.value = this.state.address ?? '';
    this.syncPaymentButtons();
    this.validateAndToggle();
  }

  private syncPaymentButtons() {
    const active = 'button_alt-active';
    const normal = 'button_alt';

    this.btnCard.classList.remove(active);
    this.btnCard.classList.add(normal);
    this.btnCash.classList.remove(active);
    this.btnCash.classList.add(normal);

    if (this.state.payment === 'card') {
      this.btnCard.classList.add(active);
      this.btnCard.classList.remove(normal);
    } else if (this.state.payment === 'cash') {
      this.btnCash.classList.add(active);
      this.btnCash.classList.remove(normal);
    }
  }

  private validate(): string[] {
    const errors: string[] = [];
    if (!this.state.payment) errors.push('Выберите способ оплаты');
    if (!this.state.address || this.state.address.length < 3) {
      errors.push('Укажите адрес доставки');
    }
    return errors;
  }

  private validateAndToggle(): boolean {
    const errors = this.validate();
    this.errorEl.textContent = errors.join('. ');
    const valid = errors.length === 0;
    this.submitBtn.disabled = !valid;
    return valid;
  }
}
