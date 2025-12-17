import { Api } from "../base/Api";
import { IProduct, IOrder } from "../../types";

interface IApiProductsResponse {
  items: IProduct[];
  total?: number;
}

interface IApiOrderResponse {
  total: number;
  id?: string;
}

export class Communication {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getProductList(): Promise<IProduct[]> {
    try {
      const response = await this.api.get<IApiProductsResponse>("/product/");
      return response.items ?? [];
    } catch (error) {
      console.error("Ошибка при получении товаров:", error);
      return [];
    }
  }

  async sendOrder(order: IOrder): Promise<IApiOrderResponse> {
    try {
      return await this.api.post<IApiOrderResponse>("/order/", order);
    } catch (error) {
      console.error("Ошибка при отправке заказа:", error);

      return { total: 0 };
    }
  }
}
