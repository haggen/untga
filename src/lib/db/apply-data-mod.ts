import { Prisma } from "@prisma/client";
import type { Operation } from "@prisma/client/runtime/library";

/**
 * Isolate data from the query args and pass it to a modifier.
 */
export async function applyDataMod<T, O extends Operation>(
  args: Prisma.Args<T, O>,
  modify: (data: T) => Promise<void>
) {
  if ("create" in args) {
    await modify(args.create);
  }

  if ("update" in args) {
    await modify(args.update);
  }

  if ("data" in args) {
    if (Array.isArray(args.data)) {
      for (const data of args.data) {
        await modify(data);
      }
    } else {
      await modify(args.data);
    }
  }
}
