import { NextRequest } from "next/server";
import { beforeAll, expect, test } from "vitest";
import { db } from "~/lib/db";
import { GET } from "./route";

const locationId = 1;
const url = new URL("http://localhost");
const params = { locationId };
const extra = { params: Promise.resolve(params) };

beforeAll(async () => {
  await db.location.create({
    data: {
      id: locationId,
      name: "Test",
      area: 1,
      difficulty: 1,
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
  const request = new NextRequest(url);
  const response = await GET(request, extra);

  expect(response.status).toBe(200);
});
