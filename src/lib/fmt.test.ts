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

test("format.string", () => {
  const value = "a TEST string";
  expect(fmt.string(value, { lower: true })).toBe("a test string");
  expect(fmt.string(value, { upper: true })).toBe("A TEST STRING");
  expect(fmt.string(value, { title: true })).toBe("A Test String");
  expect(fmt.string(value, {})).toBe(value);
});

test("format.userAgent", () => {
  const userAgent =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";
  expect(fmt.userAgent(userAgent)).toBe("WebKit (macOS)");
  expect(fmt.userAgent("invalid")).toBe("unknown browser");
});

test("format.location.security", () => {
  expect(fmt.location.security(100)).toMatch(/.+/);
  expect(fmt.location.security(50)).toMatch(/.+/);
  expect(fmt.location.security(0)).toMatch(/.+/);
});

test("format.location.population", () => {
  expect(fmt.location.population(100)).toMatch(/.+/);
  expect(fmt.location.population(50)).toMatch(/.+/);
  expect(fmt.location.population(0)).toMatch(/.+/);
});

test("format.location.area", () => {
  expect(fmt.location.area(100)).toMatch(/.+/);
  expect(fmt.location.area(50)).toMatch(/.+/);
  expect(fmt.location.area(0)).toMatch(/.+/);
});

test("format.character.skill", () => {
  expect(fmt.character.skill(100)).toMatch(/.+/);
  expect(fmt.character.skill(50)).toMatch(/.+/);
  expect(fmt.character.skill(0)).toMatch(/.+/);
});

test("format.character.health", () => {
  expect(fmt.character.health(100)).toMatch(/.+/);
  expect(fmt.character.health(50)).toMatch(/.+/);
  expect(fmt.character.health(0)).toMatch(/.+/);
});

test("format.character.stamina", () => {
  expect(fmt.character.stamina(100)).toMatch(/.+/);
  expect(fmt.character.stamina(50)).toMatch(/.+/);
  expect(fmt.character.stamina(0)).toMatch(/.+/);
});

test("format.character.status", () => {
  expect(fmt.character.status("idle")).toBe("Idle");
});

test("format.item.quality", () => {
  expect(fmt.item.quality(100)).toMatch(/.+/);
  expect(fmt.item.quality(50)).toMatch(/.+/);
  expect(fmt.item.quality(0)).toMatch(/.+/);
});

test("format.item.durability", () => {
  expect(fmt.item.durability(100)).toMatch(/.+/);
  expect(fmt.item.durability(50)).toMatch(/.+/);
  expect(fmt.item.durability(0)).toMatch(/.+/);
});

test("format.item.amount", () => {
  expect(fmt.item.amount(100)).toMatch(/.+/);
  expect(fmt.item.amount(50)).toMatch(/.+/);
  expect(fmt.item.amount(0)).toMatch(/.+/);
});
