import './scss/styles.scss';

import { Api as BaseApi } from './components/base/Api';
import LarekApi from './components/Services/LarekApi';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';
import ProductCatalogModel from './components/Models/ProductCatalogModel';
import CartModel from './components/Models/CartModel';
import BuyerModel from './components/Models/BuyerModel';

const productsModel = new ProductCatalogModel();
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems());
const first = productsModel.getById(apiProducts.items[0].id) || null;
productsModel.setSelected(first);
console.log('Выбранный товар каталога:', productsModel.getSelected());

const cart = new CartModel();
console.log('Корзина пустая:', cart.getItems(), cart.getCount(), cart.getTotal());
cart.add(apiProducts.items[0]);
cart.add(apiProducts.items[1]);
console.log('Корзина после добавления:', cart.getItems(), cart.getCount(), cart.getTotal(), cart.has(apiProducts.items[0].id));
cart.remove(apiProducts.items[0].id);
console.log('Корзина после удаления:', cart.getItems(), cart.getCount(), cart.getTotal());
cart.clear();
console.log('Корзина после очистки:', cart.getItems(), cart.getCount(), cart.getTotal());

const buyer = new BuyerModel();
buyer.setData({ payment: 'card', address: 'SPB', email: 'user@example.com', phone: '+79990000000' });
console.log('Данные покупателя:', buyer.getData(), buyer.validate());
buyer.setEmail('wrong');
console.log('Невалидные данные покупателя:', buyer.getData(), buyer.validate());
buyer.clear();
console.log('Данные покупателя очищены:', buyer.getData(), buyer.validate());

(async () => {
  const transport = new BaseApi(API_URL);
  const api = new LarekApi(transport);

  const items = await api.getProducts();
  productsModel.setItems(items);
  console.log('Каталог с сервера, шт:', items.length);
})().catch(e => console.error('Ошибка загрузки каталога:', e));