import { NextRequest, NextResponse } from "next/server";
import { expect, test, vi } from "vitest";
import { Context, withPipeline } from "./api";

test("withPipeline", async () => {
  const url = new URL("http://localhost");
  const request = new NextRequest(url);
  const params = {};
  const extra = { params: Promise.resolve(params) };
  const response = new NextResponse();

  const one = vi.fn(async (context: Context<{ one: true }>) => {
    context.state.one = true;
    return await context.next();
  });

  const two = vi.fn(async (context: Context<{ two: true }>) => {
    context.state.two = true;
    return response;
  });

  const three = vi.fn(async () => response);

  const pipeline = withPipeline(one, two, three);

  expect(await pipeline(request, extra)).toBe(response);

  expect(one).toHaveBeenCalledBefore(two);
  expect(two).toHaveBeenCalled();
  expect(three).not.toHaveBeenCalled();

  expect(one.mock.calls[0][0]).toEqual({
    request,
    params,
    state: expect.any(Object),
    next: expect.any(Function),
  });
});
