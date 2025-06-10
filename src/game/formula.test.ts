import { describe, expect, test } from "vitest";
import {
  getRestingRecoveryRate,
  getTravelDistance,
  getTravelSpeed,
  getTravelStaminaCost,
} from "./formula";

describe("getTravelStaminaCost", () => {
  test("30km at zero skill", () => {
    expect(
      getTravelStaminaCost({ distance: 30, endurance: { level: 0, cap: 100 } })
    ).toBe(100);
  });

  test("30km at 100% skill", () => {
    expect(
      getTravelStaminaCost({
        distance: 30,
        endurance: { level: 100, cap: 100 },
      })
    ).toBe(50);
  });

  test("zero distance", () => {
    expect(
      getTravelStaminaCost({ distance: 0, endurance: { level: 100, cap: 100 } })
    ).toBe(0);
  });
});

describe("getRestingRecoveryRate", () => {
  test("worst bed", () => {
    expect(getRestingRecoveryRate({ time: 1, quality: 0 })).toEqual(8);
  });

  test("best bed", () => {
    expect(getRestingRecoveryRate({ time: 1, quality: 100 })).toEqual(12);
  });

  test("average bed", () => {
    expect(getRestingRecoveryRate({ time: 1, quality: 50 })).toEqual(10);
  });
});

describe("getTravelSpeed", () => {
  test("zero skill", () => {
    expect(getTravelSpeed({ endurance: { level: 0, cap: 100 } })).toEqual(3);
  });

  test("100% skill", () => {
    expect(getTravelSpeed({ endurance: { level: 100, cap: 100 } })).toEqual(6);
  });

  test("50% skill", () => {
    expect(getTravelSpeed({ endurance: { level: 50, cap: 100 } })).toEqual(4.5);
  });
});

describe("getTravelTotalDistance", () => {
  test("zero distance", () => {
    expect(
      getTravelDistance({ destination: { area: 0 }, route: { area: 0 } })
    ).toBe(0);
  });

  test("10km on a 10km route", () => {
    expect(
      getTravelDistance({ destination: { area: 10 }, route: { area: 10 } })
    ).toBe(20);
  });
});
