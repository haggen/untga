import {
  ForbiddenError,
  GameStateError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error";
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

      if (error instanceof UnauthorizedError) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      if (error instanceof ForbiddenError) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }

      if (error instanceof NotFoundError) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      if (error instanceof ZodError) {
        return NextResponse.json({ error }, { status: 422 });
      }

      if (error instanceof GameStateError) {
        return NextResponse.json({ error: error.message }, { status: 422 });
      }

      if (error instanceof Error) {
        // Fix https://www.reddit.com/r/nextjs/comments/1gkxdqe/comment/m19kxgn/
        console.error(error.stack);

        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.error(error);

      return NextResponse.json(
        { error: JSON.stringify(error) },
        { status: 500 }
      );
    }
  };
}
