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

type StringFormatOptions = LocaleOption &
  (
    | {
        lower?: boolean;
      }
    | {
        upper?: boolean;
      }
    | {
        title?: boolean;
      }
  );

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
  const os = ua.os?.name ?? "unknown system";

  return `${browser} (${os})`;
}

export function string(string: string, options: StringFormatOptions) {
  if ("lower" in options) {
    return string.toLowerCase();
  }

  if ("upper" in options) {
    return string.toUpperCase();
  }

  if ("title" in options) {
    return string.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return string;
}

export function security(security: number) {
  if (security === 100) {
    return "Safe";
  }

  if (security >= 70) {
    return "Maintained";
  }

  if (security >= 40) {
    return "Unsettled";
  }

  return "Lawless";
}

export function skill(level: number) {
  if (level === 100) {
    return "Master";
  }

  if (level >= 80) {
    return "Expert";
  }

  if (level >= 60) {
    return "Journeyman";
  }

  if (level >= 40) {
    return "Apprentice";
  }

  if (level >= 20) {
    return "Novice";
  }

  return "Untrained";
}

export function health(level: number) {
  if (level === 100) {
    return "Healthy";
  }

  if (level >= 80) {
    return "Bruised";
  }

  if (level >= 40) {
    return "Hurt";
  }

  if (level >= 20) {
    return "Wounded";
  }

  if (level > 0) {
    return "Critical";
  }

  return "Unconscious";
}

export function stamina(level: number) {
  if (level === 100) {
    return "Rested";
  }

  if (level >= 60) {
    return "Winded";
  }

  if (level >= 20) {
    return "Tired";
  }

  return "Exhausted";
}

export function quality(quality: number) {
  if (quality === 100) {
    return "Masterwork";
  }

  if (quality >= 80) {
    return "Exceptional";
  }

  if (quality >= 60) {
    return "Fine";
  }

  if (quality >= 30) {
    return "Regular";
  }

  return "Crude";
}

export function durability(durability: number) {
  if (durability === 100) {
    return "Unused";
  }

  if (durability >= 60) {
    return "Good";
  }

  if (durability >= 20) {
    return "Worn";
  }

  if (durability > 0) {
    return "Damaged";
  }

  return "Broken";
}

export function population(population: number) {
  if (population >= 20) {
    return "Bustling";
  }

  if (population >= 10) {
    return "Crowded";
  }

  if (population > 0) {
    return "Sparse";
  }

  return "Uninhabited";
}

export function amount(amount: number) {
  if (amount > 0) {
    return "×" + number(amount);
  }

  return "None";
}

function status(status: string) {
  return string(status, { title: true });
}

export const fmt = {
  string,
  number,
  plural,
  datetime,
  userAgent,
  location: {
    security,
    population,
  },
  character: {
    skill,
    health,
    stamina,
    status,
  },
  item: {
    quality,
    durability,
    amount,
  },
};
