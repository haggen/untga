import { UAParser } from "ua-parser-js";

type LocaleOption = { locale?: string };

type NumberFormatOptions = LocaleOption & Intl.NumberFormatOptions;

type DateTimeFormatOptions = LocaleOption & Intl.DateTimeFormatOptions;

type PluralFormatOptions = LocaleOption & {
  placeholder?: string;
  zero?: string;
  one: string;
  two?: string;
  few?: string;
  many?: string;
  other?: string;
};

/**
 * Format a number using the `Intl.NumberFormat` API.
 * @example number(1000); //=> "1,000"
 * @example number(1000, { locale: "pt-BR", style: "currency", currency: "BRL" }); //=> "R$ 1.000,00"
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 */
function number(
  value: number,
  { locale = "en-US", ...options }: NumberFormatOptions = {}
) {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Pluralize a message according to the given countable.
 * @example plural(2, { one: "# apple" }); //=> "2 apples"
 * @example plural(1, { one: "an elf", other: "# elves" }); //=> "an elf"
 * @example plural(4, { placeholder: "%", one: "Pole position", other: "Position #%", zero: "Disqualified" }); //=> "Position: #4"
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules
 */
function plural(
  count: number,
  {
    locale = "en-US",
    placeholder = "#",
    one,
    other = `${one}s`,
    zero = other,
    two = other,
    few = other,
    many = other,
    ...options
  }: PluralFormatOptions
) {
  // Apparently PluralRules do not return "zero" for all locales.
  const rule =
    count === 0 ? "zero" : new Intl.PluralRules(locale, options).select(count);
  const value = number(count, { locale, ...options });

  return {
    zero,
    one,
    two,
    few,
    many,
    other,
  }[rule].replace(placeholder, value);
}

/**
 * Format a date using the `Intl.DateTimeFormat` API.
 * @example datetime(new Date()); //=> "12/31/2023"
 * @example datetime(new Date(), { locale: "pt-BR", year: "numeric", month: "long", day: "numeric" }); //=> "31 de dezembro de 2023"
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 */
function datetime(
  date: Date | string,
  { locale = "en-US", ...options }: DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

/**
 * Format user agent string.
 */
function userAgent(userAgent: string) {
  const ua = UAParser(userAgent);

  const browser = ua.browser ?? "unknown browser";
  const version = ua.browser?.major ? ` ${ua.browser.major}` : "";
  const os = ua.os?.name ?? "unknown system";

  return `${browser}${version} (${os})`;
}

export const fmt = {
  number,
  plural,
  datetime,
  userAgent,
};
