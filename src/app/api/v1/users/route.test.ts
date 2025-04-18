import { NextRequest } from "next/server";
import { expect, test } from "vitest";
import { POST } from "./route";

const url = new URL("http://localhost:3000/api/v1/users");
const params = Promise.resolve({});
const headers = {
  "content-type": "application/json",
};

test("POST bad request", async () => {
  const request = new NextRequest(url, { method: "POST", headers });
  const response = await POST(request, { params });

  expect(response.status).toBe(400);
});

test("POST bad data", async () => {
  const request = new NextRequest(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ email: "invalid-email", password: "short" }),
  });

  const response = await POST(request, { params });

  expect(response.status).toBe(422);
});

test("POST successfully", async () => {
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
