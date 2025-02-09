const hour = 1;
const day = 24 * hour;
const year = 365 * day;

type Unit = "hours" | "days" | "years";

export function from(value: number, unit: Unit) {
  switch (unit) {
    case "years":
      return value * year;
    case "days":
      return value * day;
    case "hours":
      return value;
    default:
      throw new Error(`Conversion from ${unit} not implemented`);
  }
}

export function to(value: number, unit: Unit) {
  switch (unit) {
    case "years":
      return Math.floor(value / year);
    case "days":
      return Math.floor(value / day);
    case "hours":
      return value;
    default:
      throw new Error(`Conversion to ${unit} not implemented`);
  }
}
