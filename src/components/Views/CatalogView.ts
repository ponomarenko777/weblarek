import { CardView, CardViewData } from "./CardView";

export class CatalogView {
  private container: HTMLElement;

  constructor(containerSelector: string) {
    const container = document.querySelector<HTMLElement>(containerSelector);
    if (!container) {
      throw new Error(`Не найден контейнер: ${containerSelector}`);
    }
    this.container = container;
  }

  render(items: CardViewData[]) {
    this.container.innerHTML = "";
    items.forEach((item) => {
      const card = new CardView(item);
      this.container.appendChild(card.getElement());
    });
  }
}
