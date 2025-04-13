import { vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));

vi.mock("@prisma/client", async () => ({
  ...(await vi.importActual("@prisma/client")),
  PrismaClient: (await vi.importActual("prismock")).PrismockClient,
}));
