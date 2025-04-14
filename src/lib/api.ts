import { isRedirectError } from "next/dist/client/components/redirect-error";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";
import {
  BadRequestError,
  ForbiddenError,
  GameStateError,
  NotFoundError,
  UnauthorizedError,
} from "~/lib/error";
import { getBody } from "~/lib/request";

export type Context<State> = {
  request: NextRequest;
  params: unknown;
  state: State;
  next: () => Promise<NextResponse>;
};

export type Handler<State> = (context: Context<State>) => Promise<NextResponse>;

const initial = async () => {
  throw new Error("Handler pipeline ended without producing a response.");
};

export function withPipeline<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  State = any,
  H extends ReadonlyArray<Handler<State>> = ReadonlyArray<Handler<State>>
>(...handlers: H) {
  return async (request: NextRequest, extra: { params: Promise<unknown> }) => {
    const params = await extra.params;

    const context = {
      request,
      params,
      state: {} as State,
      next: initial,
    };

    const pipeline = handlers.reduceRight<Handler<State>>(
      (next, handler) => (context) =>
        handler({ ...context, next: () => next(context) }),

      initial
    );

    return await pipeline(context);
  };
}

export function withErrorHandling() {
  return async ({ next }: Context<unknown>) => {
    try {
      return await next();
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }

      if (error instanceof BadRequestError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
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

export function withPayload<Shape extends z.ZodRawShape>(shape: Shape) {
  return async (context: Context<{ payload: z.infer<z.ZodObject<Shape>> }>) => {
    const payload = await getBody(context.request);

    context.state.payload = z.object(shape).parse(payload);

    return await context.next();
  };
}
