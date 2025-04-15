import { NextRequest } from "next/server";
import { beforeAll, expect, test } from "vitest";
import { db } from "~/lib/db";
import { setActiveSession } from "~/lib/session";
import { createSession } from "~/testing/session";
import { DELETE, GET, PATCH } from "./route";

const userId = 1;
const characterId = 1;
const url = new URL("http://localhost");
const params = { characterId };
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

  await db.character.create({
    data: {
      id: characterId,
      name: "Test",
      userId: 1,
      locationId: 1,
    },
  });
});

test("GET not found", async () => {
  const request = new NextRequest(url, { method: "GET" });
  const response = await GET(request, {
    params: Promise.resolve({ characterId: 99 }),
  });

  expect(response.status).toBe(404);
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

test("PATCH bad data", async () => {
  setActiveSession(await createSession(userId));

  const request = new NextRequest(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ description: false }),
  });
  const response = await PATCH(request, extra);

  expect(response.status).toBe(422);
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
  setActiveSession(await createSession(1));

  const request = new NextRequest(url, { method: "DELETE" });
  const response = await DELETE(request, extra);

  expect(response.status).toBe(200);
});
