// src/components/Models/Communication.ts
import { Api } from '../base/Api';
import { IProduct, IOrder } from '../../types';

interface IApiProductsResponse {
  items: IProduct[];
  total?: number;
}

interface IApiOrderResponse {
  total: number;   // сервер возвращает сумму списания
  id?: string;     // иногда ещё приходит id заказа
}

export class Communication {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  /** Получение массива товаров с сервера */
  async getProductList(): Promise<IProduct[]> {
    try {
      // путь относительный, т.к. baseURL уже есть внутри Api
      const response = await this.api.get<IApiProductsResponse>('/product/');
      return response.items ?? [];
    } catch (error) {
      console.error('Ошибка при получении товаров:', error);
      return [];
    }
  }

  /** Отправка данных заказа на сервер */
  async sendOrder(order: IOrder): Promise<IApiOrderResponse> {
    try {
      // тоже относительный путь
      return await this.api.post<IApiOrderResponse>('/order/', order);
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error);
      // возвращаем безопасный дефолт, чтобы не упал рендер Success
      return { total: 0 };
    }
  }
}