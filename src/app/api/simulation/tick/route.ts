import { NextResponse } from "next/server";
import { createHandlerPipeline, withErrorHandling } from "~/lib/api";
import { sim } from "~/simulation";

export const POST = createHandlerPipeline(withErrorHandling(), async () => {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 403 });
  }

  await sim.tick();

  return new NextResponse(null, { status: 204 });
});
