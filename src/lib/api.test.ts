import { NextRequest, NextResponse } from "next/server";
import { expect, test, vi } from "vitest";
import { Context, withPipeline } from "./api";

test("", async () => {
  const url = new URL("http://localhost");
  const request = new NextRequest(url);
  const params = {};
  const extra = { params: Promise.resolve(params) };
  const response = new NextResponse();

  const a = vi.fn(async (context: Context<{ a: true }>) => {
    context.state.a = true;
    return await context.next();
  });

  const b = vi.fn(async (context: Context<{ b: true }>) => {
    context.state.b = true;
    return await context.next();
  });

  const c = vi.fn(async () => response);
  const d = vi.fn(async () => response);

  const pipeline = withPipeline(a, b, c, d);

  expect(await pipeline(request, extra)).toBe(response);

  expect(a).toHaveBeenCalledBefore(b);
  expect(b).toHaveBeenCalledBefore(c);
  expect(d).not.toHaveBeenCalled();

  expect(a.mock.calls[0][0]).toEqual({
    request,
    params,
    state: expect.any(Object),
    next: expect.any(Function),
  });
});
