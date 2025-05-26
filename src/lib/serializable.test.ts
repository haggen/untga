import { expect, test } from "vitest";
import { serializable } from "./serializable";

const date = "2020-02-20T00:00:00.000Z";

class JSON {
  toJSON() {
    return "json";
  }
}

test("scalar", () => {
  expect(serializable("string")).toBe("string");
  expect(serializable(123)).toBe(123);
  expect(serializable(true)).toBe(true);
  expect(serializable(null)).toBe(null);
  expect(serializable(new JSON())).toBe("json");
});

test("bigint", () => {
  expect(serializable(BigInt(123))).toBe("123");
});

test("date", () => {
  expect(serializable(date)).toEqual(date);
});

test("array", () => {
  expect(
    serializable([
      1,
      "string",
      true,
      BigInt(123),
      new Date(date),
      undefined,
      null,
      () => undefined,
      new JSON(),
    ])
  ).toEqual([1, "string", true, "123", date, null, null, null, "json"]);
});

test("object", () => {
  expect(
    serializable({
      a: 1,
      b: "string",
      c: true,
      d: BigInt(123),
      e: new Date(date),
      f: undefined,
      g: null,
      h: () => undefined,
      i: new JSON(),
    })
  ).toEqual({
    a: 1,
    b: "string",
    c: true,
    d: "123",
    e: date,
    g: null,
    i: "json",
  });
});
