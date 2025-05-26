import { expect, test } from "vitest";
import { ensure } from "./ensure";

test("ensure(non empty string)", () => {
  const value = "test";
  expect(ensure(value)).toBe(value);
});

test("ensure(0)", () => {
  const value = 0;
  expect(ensure(value)).toBe(value);
});

test("ensure(empty string)", () => {
  const value = "";
  expect(ensure(value)).toBe(value);
});

test("ensure(null)", () => {
  expect(() => ensure(null)).toThrow("Expected a non nullable value");
});

test("ensure(undefined)", () => {
  expect(() => ensure(undefined)).toThrow("Expected a non nullable value");
});

test("custom string error", () => {
  const err = "Error";
  expect(() => ensure(null, err)).toThrow(err);
});

test("custom Error", () => {
  const err = new Error("Error");
  expect(() => ensure(null, err)).toThrow(err);
});
