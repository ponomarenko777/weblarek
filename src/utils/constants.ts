export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;
console.log(API_ORIGIN, "API_ORIGIN");

export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;

export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

export const settings = {};

export const categoryMap: Record<string, { label: string; mod: string }> = {
  "софт-скил": { label: "софт-скил", mod: "soft" },
  "хард-скил": { label: "хард-скил", mod: "hard" },
  другое: { label: "другое", mod: "other" },
  дополнительное: { label: "дополнительное", mod: "additional" },
  кнопка: { label: "кнопка", mod: "button" },
};
