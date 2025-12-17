export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}
export type TPayment = "card" | "cash" | "";
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IProductsResponse {
  items: IProduct[];
}

export type ProductId = IProduct["id"];

export interface IOrderRequest extends IBuyer {
  items: ProductId[];
  total: number;
}

export interface IOrderResponse {
  id: string;
  total?: number;
}
export interface IOrder {
  items: string[];
  payment: TPayment;
  address: string;
  email: string;
  phone: string;
  total: number;
}

export interface CardSelectPayload {
  id: string;
}

export interface CartRemovePayload {
  index: number;
}

export interface CartRemoveByIdPayload {
  id: string;
}

export interface OrderNextPayload {
  payment: IBuyer["payment"];
  address: string;
}

export interface OrderConfirmPayload {
  email: string;
  phone: string;
}
