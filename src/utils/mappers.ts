import { IProduct } from "../types";
import { CardViewData } from "../components/Views/CardView";
import { CartItemData } from "../components/Views/CartView";
import { categoryMap } from "./constants";

export function normalizeCategory(raw: string): string {
  return categoryMap[raw]?.mod || "other";
}

export function toCardViewData(products: IProduct[]): CardViewData[] {
  return products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price ?? null,
    category: normalizeCategory(p.category),
    image: p.image,
  }));
}

export function toCartItemData(items: IProduct[]): CartItemData[] {
  return items.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price ?? 0,
  }));
}
