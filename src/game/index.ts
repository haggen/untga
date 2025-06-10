import { simulation } from "~/game/simulation";
import { rate, tick } from "~/game/tick";

import "~/game/simulation/equipment";
import "~/game/simulation/resting";
import "~/game/simulation/travel";

export const game = {
  simulation,
  tick,
  rate,
};
