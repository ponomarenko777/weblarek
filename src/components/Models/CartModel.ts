import { IProduct } from '../../types/index.ts';

export default class CartModel {
  private _items: IProduct[] = [];

  constructor(initial?: IProduct[]) {
    if (initial) this._items = initial;
  }

  getItems(): IProduct[] {
    return this._items;
  }

  add(product: IProduct): void {
    this._items.push(product);
  }

  remove(id: string): void {
    this._items = this._items.filter(i => i.id !== id);
  }

  clear(): void {
    this._items = [];
  }

  getTotal(): number {
    return this._items.reduce((sum, i) => sum + (i.price ?? 0), 0);
  }

  getCount(): number {
    return this._items.length;
  }

  has(id: string): boolean {
    return this._items.some(i => i.id === id);
  }
}