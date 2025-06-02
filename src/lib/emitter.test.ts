import { expect, test, vi } from "vitest";
import { Emitter } from "./emitter";

test("Emitter", async () => {
  const emitter = new Emitter();

  const foo = vi.fn();
  const bar = vi.fn();
  const baz = vi.fn();

  emitter.on(["Bar", "Baz", "Fez"], baz);
  emitter.on(["Bar", "Foo"], bar);
  emitter.on(["Foo"], foo);

  const data = {};

  await emitter.emit(["Foo", "Bar"], data);

  expect(foo).toBeCalledWith(data);
  expect(bar).toBeCalledWith(data);
  expect(foo).toHaveBeenCalledBefore(bar);
  expect(baz).not.toBeCalled();
});
