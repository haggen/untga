import { expect, test, vi } from "vitest";
import { Emitter } from "./emitter";

test("Emitter", async () => {
  const handler = vi.fn(({}: { characterId: number; itemId: number }) =>
    Promise.resolve(undefined)
  );
  const emitter = new Emitter().on(["unequip"], handler);

  await emitter.emit(["unequip"], { characterId: 1, itemId: 2 });

  expect(handler).toHaveBeenCalledWith({ characterId: 1, itemId: 2 });
});
