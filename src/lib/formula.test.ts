import { describe, expect, test } from "vitest";
import { getRestTime, getTravelStaminaCost, getTravelTime } from "./formula";

describe("getTravelStaminaCost", () => {
  test("30km at zero skill", () => {
    expect(getTravelStaminaCost({ distance: 30, skill: 0 })).toBe(100);
  });

  test("30km at 100% skill", () => {
    expect(getTravelStaminaCost({ distance: 30, skill: 100 })).toBe(50);
  });

  // Assuming an average distance between villages of 2km.
  test("2km at zero skill", () => {
    expect(getTravelStaminaCost({ distance: 2, skill: 0 })).toBe(7);
  });

  test("zero distance", () => {
    expect(getTravelStaminaCost({ distance: 0, skill: 100 })).toBe(1);
  });
});

describe("getTravelTime", () => {
  test("1km at zero skill", () => {
    expect(getTravelTime({ distance: 1, skill: 0 }).hours).toBeCloseTo(0.333);
  });

  test("1km at 100% skill", () => {
    expect(getTravelTime({ distance: 1, skill: 100 }).hours).toBeCloseTo(0.166);
  });

  test("20km at 50% skill", () => {
    expect(getTravelTime({ distance: 20, skill: 50 }).hours).toBeCloseTo(4.444);
  });

  test("zero distance", () => {
    expect(getTravelTime({ distance: 0, skill: 100 }).hours).toBeCloseTo(0.016);
  });
});

describe("getRestTime", () => {
  test("0% stamina at 0% quality", () => {
    expect(getRestTime({ stamina: 0, quality: 0 }).hours).toBeCloseTo(12);
  });

  test("0% stamina at 100% quality", () => {
    expect(getRestTime({ stamina: 0, quality: 100 }).hours).toBeCloseTo(8);
  });

  test("min cap", () => {
    expect(getRestTime({ stamina: 100, quality: 0 }).hours).toBeCloseTo(0.016);
  });

  test("25% stamina at 0% quality", () => {
    expect(getRestTime({ stamina: 25, quality: 0 }).hours).toBeCloseTo(9);
  });

  test("50% stamina at 0% quality", () => {
    expect(getRestTime({ stamina: 50, quality: 0 }).hours).toBeCloseTo(6);
  });

  test("75% stamina at 0% quality", () => {
    expect(getRestTime({ stamina: 75, quality: 0 }).hours).toBeCloseTo(3);
  });
});
