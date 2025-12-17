import { cloneTemplate } from "../../utils/dom";
import { categoryMap } from "../../utils/constants";
import { resolveImagePath } from "../../utils/utils";
import { events } from "../base/Events";

export interface CardViewData {
  id: string;
  title: string;
  price: number | null;
  category: string;
  image: string;
}

export class CardView {
  private element: HTMLButtonElement;
  private titleEl: HTMLElement;
  private priceEl: HTMLElement;
  private categoryEl: HTMLElement;
  private imageEl: HTMLImageElement;

  constructor(private data: CardViewData) {
    this.element = cloneTemplate<HTMLButtonElement>("card-catalog");
    this.titleEl = this.element.querySelector(".card__title")!;
    this.priceEl = this.element.querySelector(".card__price")!;
    this.categoryEl = this.element.querySelector(".card__category")!;
    this.imageEl = this.element.querySelector(".card__image")!;

    this.render(data);
    this.attachEvents();
  }

  render(data: CardViewData): HTMLButtonElement {
    this.data = data;

    this.titleEl.textContent = data.title;

    // Цена: если null → пишем "Бесценно"
    this.priceEl.textContent =
      data.price === null ? "Бесценно" : `${data.price} синапсов`;

    // Категория
    this.setCategory(data.category);

    // Картинка
    this.imageEl.src = resolveImagePath(data.image);
    this.imageEl.alt = data.title;

    return this.element;
  }

  getElement(): HTMLButtonElement {
    return this.element;
  }

  private attachEvents() {
    this.element.addEventListener("click", () => {
      events.emit("card:select", { id: this.data.id });
    });
  }

  private setCategory(category: string) {
    const entry = Object.values(categoryMap).find((c) => c.mod === category);

    this.categoryEl.textContent = entry?.label || category;
    this.categoryEl.className = `card__category card__category_${
      entry?.mod || "other"
    }`;
  }
}
