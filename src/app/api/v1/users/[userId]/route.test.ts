import { NextRequest } from "next/server";
import { beforeAll, expect, test } from "vitest";
import { db } from "~/lib/db";
import { setActiveSession } from "~/lib/session";
import { createSession } from "~/testing/session";
import { DELETE, GET, PATCH } from "./route";

const userId = 1;
const url = new URL(`http://localhost/api/v1/users/${userId}`);
const params = { userId };
const extra = { params: Promise.resolve(params) };
const headers = {
  "content-type": "application/json",
};

beforeAll(async () => {
  await db.user.create({
    data: {
      email: "player@example.com",
      password: "0123456789abcdef",
    },
  });
});

test("GET unauthorized", async () => {
  const request = new NextRequest(url);
  const response = await GET(request, extra);

  expect(response.status).toBe(401);
});

test("GET successfully", async () => {
  setActiveSession(await createSession(userId));

  const request = new NextRequest(url);
  const response = await GET(request, extra);

  expect(response.status).toBe(200);
});

test("PATCH bad request", async () => {
  const request = new NextRequest(url, {
    method: "PATCH",
    headers,
  });
  const response = await PATCH(request, extra);

  expect(response.status).toBe(400);
});

test("PATCH unauthorized", async () => {
  const request = new NextRequest(url, {
    method: "PATCH",
    headers,
    body: "{}",
  });
  const response = await PATCH(request, extra);

  expect(response.status).toBe(401);
});

test("PATCH bad data", async () => {
  setActiveSession(await createSession(userId));

  const request = new NextRequest(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ email: "invalid-email", password: "short" }),
  });
  const response = await PATCH(request, extra);

  expect(response.status).toBe(422);
});

test("PATCH successfully", async () => {
  setActiveSession(await createSession(userId));

  const request = new NextRequest(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      email: "player@example.com",
      password: "0123456789abcdef",
    }),
  });
  const response = await PATCH(request, extra);

  expect(response.status).toBe(200);
});

test("DELETE unauthorized", async () => {
  const request = new NextRequest(url, { method: "DELETE" });
  const response = await DELETE(request, extra);

  expect(response.status).toBe(401);
});

test("DELETE successfully", async () => {
  setActiveSession(await createSession(userId));

  const request = new NextRequest(url, { method: "DELETE" });
  const response = await DELETE(request, extra);

  expect(response.status).toBe(200);
});
