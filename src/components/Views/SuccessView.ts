import { cloneTemplate } from "../../utils/dom";
import { events } from "../base/Events";

export class SuccessView {
  private element: HTMLElement;
  private descriptionEl: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor() {
    this.element = cloneTemplate<HTMLElement>("success");
    this.descriptionEl = this.element.querySelector(
      ".order-success__description"
    )!;
    this.closeButton = this.element.querySelector(".order-success__close")!;

    this.closeButton.addEventListener("click", () => {
      events.emit("success:close", {});
    });
  }

  render(total: number): HTMLElement {
    this.descriptionEl.textContent = `Списано ${total} синапсов`;
    return this.element;
  }
}
