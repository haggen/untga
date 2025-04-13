import { NextRequest } from "next/server";
import { afterAll, expect, test } from "vitest";
import { db } from "~/lib/db";
import { POST } from "./route";

afterAll(async () => {
  await db.session.deleteMany();
  await db.user.deleteMany();
});

const url = new URL("http://localhost:3000/api/v1/users");
const params = Promise.resolve({});
const headers = {
  "content-type": "application/json",
};

test("bad request", async () => {
  const request = new NextRequest(url, { method: "POST", headers });
  const response = await POST(request, { params });

  expect(response.status).toBe(400);
});

test("validation error", async () => {
  const request = new NextRequest(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ email: "invalid-email", password: "short" }),
  });

  const response = await POST(request, { params });

  expect(response.status).toBe(422);
});

test("success", async () => {
  const request = new NextRequest(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: "player@example.com",
      password: "0123456789abcdef",
    }),
  });

  const response = await POST(request, { params });

  expect(response.status).toBe(201);
});
