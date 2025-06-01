import { isRedirectError } from "next/dist/client/components/redirect-error";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError, ZodRawShape } from "zod/v4";
import { db, Session, WithUser } from "~/db";
import { HttpError, UnauthorizedError } from "~/lib/error";
import { getBody } from "~/lib/request";

/**
 * Request context.
 */
export type Context<State> = {
  request: NextRequest;
  params: unknown;
  state: State;
  next: () => Promise<NextResponse>;
};

/**
 * Handler function for processing requests.
 */
export type Handler<State> = (context: Context<State>) => Promise<NextResponse>;

/**
 * Next's route handler.
 */
type NextRouteHandler = (
  request: NextRequest,
  extra: { params: Promise<unknown> }
) => Promise<NextResponse>;

/**
 * Creates a pipeline of handlers that can be used to process a request.
 */
export function createHandlerPipeline<S1 = unknown, S2 = S1>(
  ...handlers: [Handler<S1>, Handler<S2>]
): NextRouteHandler;
export function createHandlerPipeline<S1 = unknown, S2 = S1, S3 = S1 & S2>(
  ...handlers: [Handler<S1>, Handler<S2>, Handler<S3>]
): NextRouteHandler;
export function createHandlerPipeline<
  S1 = unknown,
  S2 = S1,
  S3 = S1 & S2,
  S4 = S1 & S2 & S3
>(
  ...handlers: [Handler<S1>, Handler<S2>, Handler<S3>, Handler<S4>]
): NextRouteHandler;
export function createHandlerPipeline<
  S1 = unknown,
  S2 = S1,
  S3 = S1 & S2,
  S4 = S1 & S2 & S3,
  S5 = S1 & S2 & S3 & S4
>(
  ...handlers: [Handler<S1>, Handler<S2>, Handler<S3>, Handler<S4>, Handler<S5>]
): NextRouteHandler;
export function createHandlerPipeline<S extends never>(
  ...handlers: Handler<S>[]
): NextRouteHandler {
  return async (request: NextRequest, extra: { params: Promise<unknown> }) => {
    const params = await extra.params;

    const context = {
      request,
      params,
      state: {} as S,
      async next() {
        throw new Error("Handler pipeline ended without producing a response.");
      },
    };

    const pipeline = handlers.reduceRight(
      (next, handler) => (context) =>
        handler({ ...context, next: () => next(context) }),

      context.next
    );

    return await pipeline(context);
  };
}

/**
 * Handle errors and produce an appropriate response.
 */
export function withErrorHandling() {
  return async ({ next }: Context<unknown>) => {
    try {
      return await next();
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }

      if (error instanceof HttpError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status, headers: error.headers }
        );
      }

      if (error instanceof ZodError) {
        return NextResponse.json({ error }, { status: 422 });
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

/**
 * Parse and validate the request body.
 */
export function withPayload<T extends ZodRawShape>(shape: T) {
  const schema = z.object(shape);

  return async (context: Context<{ payload: z.infer<typeof schema> }>) => {
    const body = await getBody(context.request);
    context.state.payload = schema.parse(body);
    return await context.next();
  };
}

/**
 * Parse and validate the request params.
 */
export function withParams<T extends ZodRawShape>(shape: T) {
  const schema = z.object(shape);

  return async (context: Context<{ params: z.infer<typeof schema> }>) => {
    context.state.params = schema.parse(context.params);
    return await context.next();
  };
}

/**
 * Authorize with a session secret as bearer token.
 */
export function withAuthorization() {
  return async (context: Context<{ session: Session<WithUser> }>) => {
    const header = context.request.headers.get("authorization");

    if (!header) {
      throw new UnauthorizedError("Missing authorization header.", {
        headers: {
          "WWW-Authenticate": "Bearer",
        },
      });
    }

    if (!header.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authorization scheme is not supported.", {
        headers: {
          "WWW-Authenticate": "Bearer",
        },
      });
    }

    const secret = header.slice("Bearer ".length).trim();

    const session = await db.session
      .findFirstOrThrow({
        where: { secret, expiresAt: { gt: new Date() } },
        include: { user: true },
      })
      .catch(() => {
        throw new UnauthorizedError("Expired or invalid bearer token.");
      });

    context.state.session = session;

    return await context.next();
  };
}
