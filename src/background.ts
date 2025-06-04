import { sim } from "~/simulation";

export const intervalId = setInterval(sim.tick, 60_000);
