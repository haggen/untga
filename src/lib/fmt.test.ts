import { expect, test } from "vitest";
import { fmt } from "./fmt";

test("format.number", () => {
  const value = 1000;
  expect(fmt.number(value)).toBe("1,000");
  expect(
    fmt.number(value, {
      locale: "pt-BR",
      style: "currency",
      currency: "BRL",
    })
  ).toMatch(/^R\$\s1.000,00$/); // The resulting string contains a non breaking space character which would be difficult to tell.
});

test("format.plural", () => {
  const options = { one: "an elf", zero: "nobody", other: "# elves" };
  expect(fmt.plural(0, options)).toBe("nobody");
  expect(fmt.plural(1, options)).toBe("an elf");
  expect(fmt.plural(2, options)).toBe("2 elves");
});

test("format.plural", () => {
  const options = {
    placeholder: "%",
    one: "Pole position",
    other: "Position #%",
    zero: "Disqualified",
  };

  expect(fmt.plural(0, options)).toBe("Disqualified");
  expect(fmt.plural(1, options)).toBe("Pole position");
  expect(fmt.plural(2, options)).toBe("Position #2");
});

test("format.datetime", () => {
  const subject = new Date("2020-02-20T00:00:00");
  expect(fmt.datetime(subject)).toBe("2/20/2020");
  expect(
    fmt.datetime(subject, {
      locale: "pt-BR",
      dateStyle: "long",
      timeStyle: "short",
    })
  ).toBe("20 de fevereiro de 2020 às 00:00");
});
