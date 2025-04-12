import { NextRequest } from "next/server";
import { expect, test } from "vitest";
import { POST } from "./route";

test("invalid payload", async () => {
  const request = new NextRequest(new URL("http://localhost/api/v1/users"), {
    method: "POST",
  });
  const response = await POST(request, { params: Promise.resolve({}) });

  expect(response.status).toBe(400);
  expect(await response.json()).toMatchObject({
    error: expect.any(Object),
  });
});
