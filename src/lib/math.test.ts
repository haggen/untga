import { describe, expect, test } from "vitest";
import { clamp, curves, interpolate } from "./math";

describe("interpolate", () => {
  test("linear interpolation", () => {
    expect(interpolate(0, 1, 0)).toBe(0);
    expect(interpolate(0, 1, 0.5)).toBe(0.5);
    expect(interpolate(0, 1, 1)).toBe(1);
  });

  test("quadratic interpolation", () => {
    expect(interpolate(0, 1, 0, curves.quadratic)).toBe(0);
    expect(interpolate(0, 1, 0.5, curves.quadratic)).toBe(0.25);
    expect(interpolate(0, 1, 1, curves.quadratic)).toBe(1);
  });

  test("negative numbers", () => {
    expect(interpolate(-10, 10, 0)).toBe(-10);
    expect(interpolate(-10, 10, 0.5)).toBe(0);
    expect(interpolate(-10, 10, 1)).toBe(10);
  });

  test("min greater than max", () => {
    expect(interpolate(20, 10, 0)).toBe(20);
    expect(interpolate(20, 10, 0.5)).toBe(15);
    expect(interpolate(20, 10, 1)).toBe(10);
  });
});

test("clamp", () => {
  expect(clamp(0, 1, -1)).toBe(0);
  expect(clamp(0, 1, 0)).toBe(0);
  expect(clamp(0, 1, 1)).toBe(1);
  expect(clamp(0, 1, 2)).toBe(1);
  expect(clamp(10, 20, 5)).toBe(10);
  expect(clamp(10, 20, 15)).toBe(15);
  expect(clamp(10, 20, 25)).toBe(20);
});
