// // src/components/Presenter/AppPresenter.ts
// import { Api } from "../base/Api";
// import { Communication } from "../Models/Communication";
// import ProductCatalogModel from "../Models/ProductCatalogModel";
// import CartModel  from "../Models/CartModel";
// import BuyerModel from '../Models/BuyerModel';

// import { API_URL, categoryMap } from "../../utils/constants";


// import { IProduct, OrderNextPayload } from "../../types";
// import { IEvents} from "../base/Events";
// import { BasketCounterView } from "../Views/BasketCounterView";
// import { EventNames } from "../../utils/utils";
// import { toCardViewData, toCartItemData } from "../../utils/mappers";

// export class AppPresenter {
//   private catalog = new ProductCatalogModel ();
//   private cart = new CartModel();
//   private buyer = new BuyerModel();

//   private api = new Api(API_URL);
//   private communication = new Communication(this.api);

//   private catalogView = new CatalogView(".gallery");
//   private cartView = new CartView();
//   private modal = new ModalView("#modal-container");

//   // ==== Утилиты ====
//   private normalizeCategory(raw: string): string {
//     return categoryMap[raw]?.mod || "other";
//   }
//   // ==== Инициализация ====
//   public init() {
//     this.loadProducts();
//     this.initEvents();
//     this.updateBasketCounter();
//   }

//   // ==== Загрузка каталога ====
//   private async loadProducts() {
//     try {
//       const productlist = await this.communication.getProductList();
//       this.catalog.setProducts(productlist);
//       this.catalogView.render(toCardViewData(productlist));
//       this.catalogView.render(toCardViewData(productlist));
//     } catch (err) {
//       console.error("Ошибка загрузки каталога:", err);
//     }
//   }

//   // ==== События ====
//   private initEvents() {
//     // карточка товара
//     events.on<{ id: string }>("card:select", ({ id }) => {
//       const product = this.catalog.getProductById(id);
//       if (!product) return;

//       const normalizedProduct = {
//         ...product,
//         category: this.normalizeCategory(product.category),
//       };

//       const previewView = new ProductPreviewView();
//       previewView.setCartChecker((pid) => this.cart.hasItem(pid));
//       const inCart = this.cart.hasItem(product.id);
//       this.modal.open(previewView.render(normalizedProduct, inCart));
//     });

//     // открыть корзину
//     const basketButton =
//       document.querySelector<HTMLButtonElement>(".header__basket");
//     if (basketButton) {
//       basketButton.addEventListener("click", () => {
//         this.modal.open(this.cartView.getElement());
//       });
//     }

//     // добавить товар
//     events.on<IProduct>("cart:add", (product) => {
//       this.cart.addItem(product);
//       this.cartView.render(toCartItemData(this.cart.getItems()));
//       this.updateBasketCounter();
//       events.emit("cart:changed");
//     });

//     // удалить товар (по индексу)
//     events.on<{ index: number }>("cart:remove", ({ index }) => {
//       const items = this.cart.getItems();
//       items.splice(index, 1);

//       this.cart.clear();
//       items.forEach((item) => this.cart.addItem(item));

//       this.cartView.render(toCartItemData(this.cart.getItems()));
//       this.updateBasketCounter();
//       events.emit("cart:changed");
//     });

//     // удалить товар (по id) — для кнопки в превью
//     events.on<{ id: string }>("cart:remove-by-id", ({ id }) => {
//       this.cart.removeItem({ id } as any);
//       this.cartView.render(toCartItemData(this.cart.getItems()));
//       this.updateBasketCounter();
//       events.emit("cart:changed");
//     });

//     // оформить заказ (шаг 1)
//     events.on("cart:order", () => {
//       const orderForm = new OrderFormView(this.buyer.getData());
//       this.modal.open(orderForm.getElement());
//     });

//     // шаг 1 → шаг 2
//     events.on<OrderNextPayload>(
//       EventNames.OrderNext,
//       ({ payment, address }) => {
//         this.buyer.setData({ payment, address });
//         const contactsForm = new ContactsFormView();
//         this.modal.open(contactsForm.getElement());
//       }
//     );

//     // шаг 2 → подтверждение
//     events.on<{ email: string; phone: string }>(
//       "order:confirm",
//       async ({ email, phone }) => {
//         this.buyer.setData({ email, phone });

//         const order = {
//           ...this.buyer.getData(),
//           items: this.cart.getItems().map((p) => p.id),
//           total: this.cart.getTotalPrice(),
//         };

//         try {
//           const result: { total: number } = await this.communication.sendOrder(
//             order
//           );
//           const success = new SuccessView();
//           this.modal.open(success.render(result.total));

//           this.cart.clear();
//           this.cartView.render([]);
//           this.updateBasketCounter();
//         } catch (err) {
//           console.error("Ошибка при заказе:", err);
//         }
//       }
//     );

//     // закрытие success
//     events.on("success:close", () => {
//       this.modal.close();
//     });
//   }

//   // ==== Счётчик корзины ====
//   private basketCounter = new BasketCounterView();
//   private updateBasketCounter() {
//     this.basketCounter.update(this.cart.getCount());
//   }
// }



// src/components/Presenter/AppPresenter.ts

import { Api } from "../base/Api";
import { Communication } from "../Models/Communication";

import ProductCatalogModel from "../Models/ProductCatalogModel";
import CartModel from "../Models/CartModel";
import BuyerModel from "../Models/BuyerModel";

import { API_URL, categoryMap } from "../../utils/constants";
import { IProduct, OrderNextPayload, IBuyer } from "../../types/index.ts";

import { events } from "../base/Events";

// ==== View компоненты ====
import { CatalogView } from "../Views/CatalogView";
import { CartView } from "../Views/CartView";
import { ModalView } from "../Views/ModalView";
import { ProductPreviewView } from "../Views/ProductPreviewView";
import { OrderFormView } from "../Views/OrderFormView";
import { ContactsFormView } from "../Views/ContactsFormView";
import { SuccessView } from "../Views/SuccessView";
import { BasketCounterView } from "../Views/BasketCounterView";

import { toCardViewData, toCartItemData } from "../../utils/mappers";

// ===========================================================
//                   P R E S E N T E R
// ===========================================================

export class AppPresenter {
  // ==== Модели ====
  private catalog = new ProductCatalogModel();
  private cart = new CartModel();
  private buyer = new BuyerModel();

  // ==== API ====
  private api = new Api(API_URL);
  private communication = new Communication(this.api);

  // ==== View ====
  private catalogView = new CatalogView(".gallery");
  private cartView = new CartView();
  private modal = new ModalView("#modal-container");
  private basketCounter = new BasketCounterView();

  // ==== Утилиты ====
  private normalizeCategory(raw: string): string {
    return categoryMap[raw as keyof typeof categoryMap]?.mod || "другое";
  }

  // ==== Инициализация ====
  public init() {
    this.loadProducts();
    this.initEvents();
    this.updateBasketCounter();
  }

  // ==== Загрузка товаров ====
  private async loadProducts() {
    try {
      const productList = await this.communication.getProductList();

      this.catalog.setItems(productList);

      this.catalogView.render(toCardViewData(productList));

    } catch (err) {
      console.error("Ошибка загрузки каталога:", err);
    }
  }

  // ==== События ====
  private initEvents() {

    // Открытие превью карточки
    events.on<{ id: string }>("card:select", ({ id }) => {

      const product = this.catalog.getById(id);   // <<< соответствует твоей модели
      if (!product) return;

      const normalizedProduct = {
        ...product,
        category: this.normalizeCategory(product.category),
      };

      const preview = new ProductPreviewView();
      preview.setCartChecker((pid) => this.cart.has(pid)); // <<< has(id)

      const inCart = this.cart.has(product.id);

      this.modal.open(preview.render(normalizedProduct, inCart));
    });

    // Открытие корзины
    const basketBtn =
      document.querySelector<HTMLButtonElement>(".header__basket");

    if (basketBtn) {
      basketBtn.addEventListener("click", () => {
        this.modal.open(this.cartView.getElement());
      });
    }

    // Добавление товара в корзину
    events.on<IProduct>("cart:add", (product) => {
      this.cart.add(product); // <<< add(product)

      this.cartView.render(toCartItemData(this.cart.getItems()));
      this.updateBasketCounter();
      events.emit("cart:changed");
    });

    // Удаление по индексу
    events.on<{ index: number }>("cart:remove", ({ index }) => {
      const items = this.cart.getItems();

      items.splice(index, 1);

      this.cart.clear();
      items.forEach((i) => this.cart.add(i));

      this.cartView.render(toCartItemData(this.cart.getItems()));
      this.updateBasketCounter();
      events.emit("cart:changed");
    });

    // Удаление по id
    events.on<{ id: string }>("cart:remove-by-id", ({ id }) => {
      this.cart.remove(id); // <<< remove(id)

      this.cartView.render(toCartItemData(this.cart.getItems()));
      this.updateBasketCounter();
      events.emit("cart:changed");
    });

    // Оформление заказа — шаг 1
    events.on("cart:order", () => {
      const orderForm = new OrderFormView(this.buyer.getData());
      this.modal.open(orderForm.getElement());
    });

    // Шаг 1 → шаг 2
    events.on<OrderNextPayload>("order:next", ({ payment, address }) => {
      this.buyer.setData({ payment, address });

      const contactsForm = new ContactsFormView(this.buyer.getData());
      this.modal.open(contactsForm.getElement());
    });

    // Шаг 2 → подтверждение
    events.on<{ email: string; phone: string }>(
      "order:confirm",
      async ({ email, phone }) => {
        this.buyer.setData({ email, phone });

        const { valid, errors } = this.buyer.validate();
        if (!valid) {
          console.warn("Ошибки в данных покупателя:", errors);
          return;
        }

        const order = {
          ...this.buyer.getData(),
          items: this.cart.getItems().map((p) => p.id),
          total: this.cart.getTotal(),
        };

        try {
          const result = await this.communication.sendOrder(order);

          const success = new SuccessView();
          this.modal.open(success.render(result.total));

          this.cart.clear();
          this.cartView.render([]);

          this.updateBasketCounter();
          this.buyer.clear();

        } catch (err) {
          console.error("Ошибка оформления заказа:", err);
        }
      }
    );

    // Закрытие success
    events.on("success:close", () => {
      this.modal.close();
    });
  }

  // ==== Обновление счётчика ====
  private updateBasketCounter() {
    this.basketCounter.update(this.cart.getCount()); // <<< getCount()
  }
}
