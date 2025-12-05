import { IProduct } from '../../types/index.ts';

export default class ProductCatalogModel {
  private _items: IProduct[] = [];
  private _selected: IProduct | null = null;

  constructor(initial?: IProduct[]) {
    if (initial) this._items = initial;
  }

  setItems(items: IProduct[]): void {
    this._items = items;
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getById(id: string): IProduct | undefined {
    return this._items.find(i => i.id === id);
  }

  setSelected(product: IProduct | null): void {
    this._selected = product;
  }

  getSelected(): IProduct | null {
    return this._selected;
  }
}