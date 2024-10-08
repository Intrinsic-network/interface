import {
  Currency,
  CurrencyAmount,
  Fraction,
  Price,
} from "@intrinsic-finance/sdk-core";
import { DEFAULT_LOCALE, SupportedLocale } from "constants/locales";
import JSBI from "jsbi";
import formatLocaleNumber from "lib/utils/formatLocaleNumber";

export function formatCurrencyAmount(
  amount: CurrencyAmount<Currency> | undefined,
  sigFigs: number,
  locale: SupportedLocale = DEFAULT_LOCALE,
  fixedDecimals?: number
): string {
  if (!amount) {
    return "--";
  }

  if (JSBI.equal(amount.quotient, JSBI.BigInt(0))) {
    return "--";
  }

  if (amount.divide(amount.decimalScale).lessThan(new Fraction(1, 100000))) {
    return `<${formatLocaleNumber({ number: 0.00001, locale })}`;
  }

  return formatLocaleNumber({ number: amount, locale, sigFigs, fixedDecimals });
}

export function formatPrice(
  price: Price<Currency, Currency> | undefined,
  sigFigs: number,
  locale: SupportedLocale = DEFAULT_LOCALE
): string {
  if (!price) {
    return "-";
  }

  if (parseFloat(price.toFixed(sigFigs)) < 0.0001) {
    return `<${formatLocaleNumber({ number: 0.00001, locale })}`;
  }

  return formatLocaleNumber({ number: price, locale, sigFigs });
}
