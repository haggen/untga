function number(value: number, opts: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-US", opts).format(value);
}

function plural(
  count: number,
  {
    singular,
    plural,
    ...opts
  }: {
    singular: string;
    plural?: string;
  } & Intl.NumberFormatOptions
) {
  return `${number(count, opts)} ${
    Math.floor(count) === 1 ? singular : plural ? plural : `${singular}s`
  }`;
}

function datetime(date: Date | string, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", opts).format(new Date(date));
}

export const format = {
  number,
  plural,
  datetime,
};
