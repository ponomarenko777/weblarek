import { IBuyer, TPayment } from '../../types/index.ts';

export default class BuyerModel {
  private _payment: TPayment | null = null;
  private _address = '';
  private _email = '';
  private _phone = '';

  constructor(initial?: Partial<IBuyer>) {
    if (initial?.payment) this._payment = initial.payment;
    if (initial?.address) this._address = initial.address;
    if (initial?.email) this._email = initial.email;
    if (initial?.phone) this._phone = initial.phone;
  }

  setData(data: Partial<IBuyer>): void {
    if (data.payment) this._payment = data.payment;
    if (data.address !== undefined) this._address = data.address;
    if (data.email !== undefined) this._email = data.email;
    if (data.phone !== undefined) this._phone = data.phone;
  }

  setPayment(v: TPayment): void { this._payment = v; }
  setAddress(v: string): void { this._address = v; }
  setEmail(v: string): void { this._email = v; }
  setPhone(v: string): void { this._phone = v; }

  getData(): IBuyer {
    return {
      payment: this._payment as TPayment,
      address: this._address,
      email: this._email,
      phone: this._phone
    };
  }

  clear(): void {
    this._payment = null;
    this._address = '';
    this._email = '';
    this._phone = '';
  }

  validate(): { valid: boolean; errors: Partial<Record<keyof IBuyer, string>> } {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    if (!this._payment) errors.payment = 'required';
    if (!this._address.trim()) errors.address = 'required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._email)) errors.email = 'invalid';
    if (!/^\+?\d[\d\s\-()]{8,}$/.test(this._phone)) errors.phone = 'invalid';
    return { valid: Object.keys(errors).length === 0, errors };
  }
}