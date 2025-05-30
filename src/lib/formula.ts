import { interpolate } from "~/lib/math";

/**
 * 1 minute in hours.
 */
const minute = 1 / 60;

/**
 * Global action scaling factor. Make it easier to balance and test.
 */
const scale = Number.parseFloat(process.env.ACTION_TIME_SCALE ?? "1.0");

/**
 * Calculate the travel speed.
 */
export function getTravelSpeed({ skill }: { skill: number }) {
  // Let's assume the fastest a person can walk is 100 meters per minute (6km/h).
  const max = 6;

  // And also that the slowest a person would walk is 50 meters per minute (3km/h).
  const min = 3;

  // So the travel speed is calculated by interpolating
  // between the minimum and maximum speeds based on the skill.
  return interpolate(min, max, skill / 100);
}

/**
 * Calculate the stamina cost of travel.
 */
export function getTravelStaminaCost({
  distance,
  skill,
}: {
  distance: number;
  skill: number;
}) {
  // Let's assume the average person could travel for about 10 hours a day on foot,
  // and that it should consume all of their stamina, but a skilled person would
  // be able to travel faster, covering more distance in the same time.
  const speed = getTravelSpeed({ skill });

  // So the base cost of stamina per km would be 100% stamina / (speed * 10h).
  const base = 100 / (speed * 10);

  return Math.round(Math.max(1, base * distance) * scale);
}

/**
 * Calculate the time it takes to travel some distance.
 */
export function getTravelTime({
  distance,
  skill,
}: {
  distance: number;
  skill: number;
}) {
  const speed = getTravelSpeed({ skill });

  // The travel time is then given by distance over speed.
  return { hours: Math.max(minute, distance / speed) * scale };
}

/**
 * Calculate the time it takes to rest to 100% stamina.
 */
export function getRestTime({
  stamina,
  quality,
}: {
  stamina: number;
  quality: number;
}) {
  // Let's assume a totally exhaused person in the worst bed possible would
  // take 12 hours of sleep to fully recover. So the low end of stamina
  // recovery rate would be 100% / 12h.
  const max = 12;

  // But in the best possible bed a totally exhausted person
  // would only take 8 hours of sleep to fully recover.
  const min = 8;

  // The base rest time to fully recover stamina is calculated
  // by interpolating between the minimum and maximum rest times
  // based on the quality of the bed.
  const base = interpolate(min, max, 1 - quality / 100);

  // But it should also depend on how much stamina the person has left;
  // The more stamina they have, the less time it should take to rest.

  return {
    hours: Math.max(minute, base * interpolate(1, 0, stamina / 100)) * scale,
  };
}
