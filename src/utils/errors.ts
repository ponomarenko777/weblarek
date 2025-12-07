export const BuyerErrors = {
  paymentRequired: "Выберите способ оплаты",
  addressRequired: "Введите адрес доставки",
  emailRequired: "Введите email",
  emailInvalid: "Некорректный email",
  phoneRequired: "Введите номер телефона",
  phoneInvalid: "Некорректный номер телефона",
} as const;

export type BuyerErrorKey = keyof typeof BuyerErrors;
