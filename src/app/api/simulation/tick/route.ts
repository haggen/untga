import { NextResponse } from "next/server";
import { game } from "~/game";
import { createHandlerPipeline, withErrorHandling } from "~/lib/api";

export const POST = createHandlerPipeline(withErrorHandling(), async () => {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 403 });
  }

  await game.tick();

  return new NextResponse(null, { status: 204 });
});
