import { Prisma } from "@/lib/prisma";
import { UnauthorizedError } from "@/lib/session";
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
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (error instanceof ZodError) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // See https://www.prisma.io/docs/orm/reference/error-reference#error-codes
        if (error.code === "P2025") {
          return NextResponse.json(
            { error: "Record not found." },
            { status: 404 }
          );
        } else if (error.code.startsWith("P2")) {
          return NextResponse.json(
            { error: `${error.code} ${error.message.trim()}` },
            { status: 400 }
          );
        } else {
          return NextResponse.json({ error }, { status: 500 });
        }
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
