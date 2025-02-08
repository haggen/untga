export function format(
  value: number,
  {
    singular,
    plural,
    ...opts
  }: { singular?: string; plural?: string } & Intl.NumberFormatOptions
) {
  const number = new Intl.NumberFormat("en-US", opts).format(value);

  if (singular) {
    return `${number} ${
      Math.floor(value) === 1 ? singular : plural ? plural : `${singular}s`
    }`;
  }

  return number;
}
