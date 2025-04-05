import {
  ForbiddenError,
  GameStateError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export type Context<S = unknown> = {
  request: NextRequest;
  params: unknown;
  state: S;
  next: () => Promise<NextResponse>;
};

export type Handler<S> = (context: Context<S>) => Promise<NextResponse>;

export type Middleware<S> = (...arg: unknown[]) => Handler<S>;

export function withMiddleware<S>(...handlers: Handler<S>[]) {
  const initial = async () => {
    throw new Error("Handler chain ended without producing a response.");
  };

  return async (req: NextRequest, extra: { params: Promise<unknown> }) => {
    const params = await extra.params;

    const context: Context<S> = {
      request: req,
      params,
      state: {} as S,
      next: initial,
    };

    const chain = handlers.reduceRight((next, handler: Handler<S>) => {
      return async (context: Context<S>) => {
        return await handler({ ...context, next: () => next(context) });
      };
    }, initial);

    return await chain(context);
  };
}

export function withErrorHandling() {
  return async ({ next }: Context) => {
    try {
      return await next();
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
