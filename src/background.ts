import { game } from "~/game";

export const intervalId = setInterval(game.tick, 60_000);
