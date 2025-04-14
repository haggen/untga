import { expect, test } from "vitest";
import { format } from "./format";

test("format.number", () => {
  const value = 1000;
  expect(format.number(value)).toBe("1,000");
  expect(
    format.number(value, {
      locale: "pt-BR",
      style: "currency",
      currency: "BRL",
    })
  ).toMatch(/^R\$\s1.000,00$/); // The resulting string contains a non breaking space character which would be difficult to tell.
});

test("format.plural", () => {
  const options = { one: "an elf", zero: "nobody", other: "# elves" };
  expect(format.plural(0, options)).toBe("nobody");
  expect(format.plural(1, options)).toBe("an elf");
  expect(format.plural(2, options)).toBe("2 elves");
});

test("format.plural", () => {
  const options = {
    placeholder: "%",
    one: "Pole position",
    other: "Position #%",
    zero: "Disqualified",
  };

  expect(format.plural(0, options)).toBe("Disqualified");
  expect(format.plural(1, options)).toBe("Pole position");
  expect(format.plural(2, options)).toBe("Position #2");
});

test("format.datetime", () => {
  const subject = new Date("2020-02-20T00:00:00Z");
  expect(format.datetime(subject)).toBe("2/19/2020");
  expect(
    format.datetime(subject, {
      locale: "pt-BR",
      dateStyle: "long",
      timeStyle: "short",
    })
  ).toBe("19 de fevereiro de 2020 às 21:00");
});
