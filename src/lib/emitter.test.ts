import { expect, test, vi } from "vitest";
import { Emitter } from "./emitter";

test("Emitter", () => {
  const emitter = new Emitter<string>();

  const a = vi.fn();
  const b = vi.fn();
  const c = vi.fn();

  emitter.on(["foo"], a);
  emitter.on(["bar"], b);
  emitter.on(["foo", "bar"], c);

  emitter.emit(["foo"], "foo");
  expect(a).toBeCalledWith("foo");
  expect(b).not.toBeCalledWith("foo");
  expect(c).toBeCalledWith("foo");

  emitter.emit(["foo", "bar"], "foo and bar");
  expect(c).toBeCalledWith("foo and bar");
  expect(a).not.toBeCalledWith("foo and bar");
  expect(b).not.toBeCalledWith("foo and bar");
});
