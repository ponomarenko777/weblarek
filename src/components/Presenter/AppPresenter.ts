import { Api } from "../base/Api";
import { Communication } from "../Models/Communication";
import ProductCatalogModel from "../Models/ProductCatalogModel";
import CartModel from "../Models/CartModel";
import BuyerModel from "../Models/BuyerModel";
import { ModalView } from "../Views/ModalView";
import { ProductPreviewView } from "../Views/ProductPreviewView";
import { CatalogView } from "../Views/CatalogView";
import { CartView } from "../Views/CartView";
import { OrderFormView } from "../Views/OrderFormView";
import { ContactsFormView } from "../Views/ContactsFormView";
import { SuccessView } from "../Views/SuccessView";
import { API_URL, categoryMap } from "../../utils/constants";
import { IProduct, OrderNextPayload } from "../../types";
import { events } from "../base/Events";
import { BasketCounterView } from "../Views/BasketCounterView";
import { EventNames } from "../../utils/utils";
import { toCardViewData, toCartItemData } from "../../utils/mappers.ts";

export class AppPresenter {
  private catalog = new ProductCatalogModel();
  private cart = new CartModel();
  private buyer = new BuyerModel();

  private api = new Api(API_URL);
  private communication = new Communication(this.api);

  private catalogView = new CatalogView(".gallery");
  private cartView = new CartView();
  private modal = new ModalView("#modal-container");

  private normalizeCategory(raw: string): string {
    return categoryMap[raw]?.mod || "other";
  }

  public init() {
    this.loadProducts();
    this.initEvents();
    this.updateBasketCounter();
  }

  private async loadProducts() {
    try {
      const productlist = await this.communication.getProductList();
      this.catalog.setItems(productlist);
      this.catalogView.render(toCardViewData(productlist));
    } catch (err) {
      console.error("Ошибка загрузки каталога:", err);
    }
  }

  private initEvents() {
    events.on<{ id: string }>("card:select", ({ id }) => {
      const product = this.catalog.getById(id);
      if (!product) return;

      const normalizedProduct = {
        ...product,
        category: this.normalizeCategory(product.category),
      };

      const previewView = new ProductPreviewView();
      previewView.setCartChecker((pid) => this.cart.has(pid));
      const inCart = this.cart.has(product.id);
      this.modal.open(previewView.render(normalizedProduct, inCart));
    });

    const basketButton =
      document.querySelector<HTMLButtonElement>(".header__basket");
    if (basketButton) {
      basketButton.addEventListener("click", () => {
        this.modal.open(this.cartView.getElement());
      });
    }

    events.on<IProduct>("cart:add", (product) => {
      this.cart.add(product);
      this.cartView.render(toCartItemData(this.cart.getItems()));
      this.updateBasketCounter();
      events.emit("cart:changed");
    });

    events.on<{ index: number }>("cart:remove", ({ index }) => {
      const items = this.cart.getItems();
      items.splice(index, 1);

      this.cart.clear();
      items.forEach((item) => this.cart.add(item));

      this.cartView.render(toCartItemData(this.cart.getItems()));
      this.updateBasketCounter();
      events.emit("cart:changed");
    });

    events.on<{ id: string }>("cart:remove-by-id", ({ id }) => {
      this.cart.remove({ id } as any);
      this.cartView.render(toCartItemData(this.cart.getItems()));
      this.updateBasketCounter();
      events.emit("cart:changed");
    });

    events.on("cart:order", () => {
      const orderForm = new OrderFormView(this.buyer.getData());
      this.modal.open(orderForm.getElement());
    });

    events.on<OrderNextPayload>(
      EventNames.OrderNext,
      ({ payment, address }) => {
        this.buyer.setData({ payment, address });
        const contactsForm = new ContactsFormView();
        this.modal.open(contactsForm.getElement());
      }
    );

    events.on<{ email: string; phone: string }>(
      "order:confirm",
      async ({ email, phone }) => {
        this.buyer.setData({ email, phone });

        const order = {
          ...this.buyer.getData(),
          items: this.cart.getItems().map((p) => p.id),
          total: this.cart.getTotal(),
        };

        try {
          const result: { total: number } = await this.communication.sendOrder(
            order
          );
          const success = new SuccessView();
          this.modal.open(success.render(result.total));

          this.cart.clear();
          this.cartView.render([]);
          this.updateBasketCounter();
        } catch (err) {
          console.error("Ошибка при заказе:", err);
        }
      }
    );

    events.on("success:close", () => {
      this.modal.close();
    });
  }

  private basketCounter = new BasketCounterView();
  private updateBasketCounter() {
    this.basketCounter.update(this.cart.getCount());
  }
}
