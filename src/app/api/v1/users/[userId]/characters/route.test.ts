import { NextRequest } from "next/server";
import { beforeAll, expect, test } from "vitest";
import { db } from "~/lib/db";
import { setActiveSession } from "~/lib/session";
import { createSession } from "~/testing/session";
import { GET } from "./route";

const userId = 1;
const url = new URL("http://localhost");
const params = { userId };
const extra = { params: Promise.resolve(params) };

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
