// src/components/Views/ModalView.ts
import { events } from '../base/Events';

export class ModalView {
  private root: HTMLElement;
  private contentContainer: HTMLElement;
  private closeButton: HTMLButtonElement | null;
  private escHandler: (e: KeyboardEvent) => void;

  constructor(rootOrSelector: HTMLElement | string = '#modal-container') {
    const root =
      typeof rootOrSelector === 'string'
        ? document.querySelector<HTMLElement>(rootOrSelector)
        : rootOrSelector;

    if (!root) {
      throw new Error('Modal root element not found (' + rootOrSelector + ')');
    }
    this.root = root;

    const content = this.root.querySelector<HTMLElement>('.modal__content');
    if (!content) {
      throw new Error('Modal content element (.modal__content) not found inside modal root');
    }
    this.contentContainer = content;

    this.closeButton = this.root.querySelector<HTMLButtonElement>('.modal__close');

    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.escHandler = this.onEsc.bind(this);

    this.initListeners();
  }

  private initListeners(): void {
    // клик по фону (оверлею)
    this.root.addEventListener('click', this.onOverlayClick);

    // крестик
    if (this.closeButton) {
      this.closeButton.addEventListener('click', this.onCloseClick);
    }
  }

  private onOverlayClick(e: MouseEvent) {
    if (e.target === this.root) {
      this.close();
      events.emit('modal:close');
    }
  }

  private onCloseClick() {
    this.close();
    events.emit('modal:close');
  }

  private onEsc(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.close();
      events.emit('modal:close');
    }
  }

  open(contentEl: HTMLElement) {
    this.contentContainer.replaceChildren(contentEl);
    this.root.classList.add('modal_active');
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', this.escHandler);
    events.emit('modal:open');
  }

  close() {
    this.root.classList.remove('modal_active');
    this.contentContainer.replaceChildren();
    document.body.style.overflow = '';
    window.removeEventListener('keydown', this.escHandler);
  }
}