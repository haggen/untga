import { beforeEach, vi } from "vitest";
import { cookies } from "./cookies";

vi.mock("next/headers", async () => ({
  ...(await vi.importActual("next/headers")),
  cookies: vi.fn(async () => cookies),
}));

vi.mock("@prisma/client", async () => ({
  ...(await vi.importActual("@prisma/client")),
  PrismaClient: (await vi.importActual("prismock")).PrismockClient,
}));

beforeEach(() => {
  cookies.clear();
});
