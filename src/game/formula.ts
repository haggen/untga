import { interpolate } from "~/lib/math";

/**
 * Compute the travel speed.
 */
export function getTravelSpeed({
  endurance,
}: {
  endurance: { level: number; cap: number };
}) {
  // Let's assume the fastest a person can travel is 6km/h.
  const max = 6;

  // And that the slowest a person would travel is 3km/h.
  const min = 3;

  // The travel speed is calculated by interpolating between the
  // minimum and maximum speeds based on the character's skill.
  return interpolate(min, max, endurance.level / endurance.cap);
}

/**
 * Compute the stamina cost of travel.
 */
export function getTravelStaminaCost({
  distance,
  endurance,
}: {
  distance: number;
  endurance: { level: number; cap: number };
}) {
  // Let's assume an average person can travel between 30km and 60km
  // before they are exhausted, depending on their endurance.
  const base = 100 / interpolate(30, 60, endurance.level / endurance.cap);

  // The final cost is given by multiplying the base
  // cost per kilometer by the given distance.
  return Math.floor(base * distance);
}

/**
 * Compute resting recovery rate.
 */
export function getRestingRecoveryRate({
  time,
  quality,
}: {
  time: number;
  quality: number;
}) {
  // Let's assume a totally exhausted person on the worst possible
  // bed would take 12 hours of sleep to fully recover. So the
  // slowest recovery rate would be 100% / 12h.
  const min = 100 / 12;

  // But on the best possible bed that person would
  // only take 8 hours of sleep to fully recover.
  const max = 100 / 8;

  // The hourly resting recovery rate is calculated by interpolating between
  // the minimum and maximum values based on the quality of the bed.
  const rate = interpolate(min, max, quality / 100);

  return Math.floor(rate * time);
}

/**
 * Compute trip distance.
 */
export function getTravelDistance({
  destination,
  route,
}: {
  destination: { area: number };
  route: { area: number };
}) {
  // The travel distance is the sum of the destination and route areas.
  return destination.area + route.area;
}
