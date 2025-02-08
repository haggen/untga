const minute = 60;
const hour = 60 * minute;
const day = 24 * hour;
const year = 365 * day;

type Unit = "seconds" | "days" | "years";

export function from(value: number, unit: Unit) {
  switch (unit) {
    case "days":
      return value * day;
    case "seconds":
      return value;
    default:
      throw new Error(`Conversion from ${unit} not implemented`);
  }
}

export function to(value: number, unit: Unit) {
  switch (unit) {
    case "days":
      return value / day;
    case "years":
      return value / year;
    case "seconds":
      return value;
    default:
      throw new Error(`Conversion to ${unit} not implemented`);
  }
}
