import { isRedirectError } from "next/dist/client/components/redirect-error";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Route handler.
 */
export type Handler<T> = (
  req: NextRequest,
  extra: { params: Promise<T> }
) => Promise<NextResponse>;

/**
 * Wraps a route handler with error handling.
 */
export function withErrorHandling<T>(handler: Handler<T>): Handler<T> {
  return async (req, extra) => {
    try {
      return await handler(req, extra);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }

      if (error instanceof ZodError) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
      }

      // Fix https://www.reddit.com/r/nextjs/comments/1gkxdqe/comment/m19kxgn/
      console.error(error instanceof Error ? error.stack : error);

      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ error }, { status: 500 });
    }
  };
}
