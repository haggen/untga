import { isRedirectError } from "next/dist/client/components/redirect-error";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { Session, WithUser } from "~/lib/db";
import { HttpError } from "~/lib/error";
import { getRequestPayload } from "~/lib/request";
import { getActiveSession } from "~/lib/session";

export type Context = {
  request: NextRequest;
  params: unknown;
  session: Session<WithUser> | null;
  payload: unknown;
};

export type Response = {
  payload?: unknown;
  status?: number;
  headers?: Record<string, unknown>;
};

export type Handler = (context: Context) => Promise<Response>;

function makeHeaders(headers: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => {
      return [key, String(value)];
    })
  ) satisfies HeadersInit;
}

export function createApiHandler(handler: Handler) {
  return async (
    request: NextRequest,
    { params }: { params: Promise<unknown> }
  ) => {
    try {
      const context = {
        request,
        params: await params,
        payload: await getRequestPayload(request),
        session: await getActiveSession(),
      };

      const response = await handler(context);

      if (request.method === "POST") {
        response.status ??= 201;
      }

      return NextResponse.json(response.payload, {
        status: response.status,
        headers: makeHeaders(response.headers ?? {}),
      });
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }

      if (error instanceof HttpError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status }
        );
      }

      if (error instanceof ZodError) {
        return NextResponse.json({ error }, { status: 422 });
      }

      if (error instanceof Error) {
        // @see https://www.reddit.com/r/nextjs/comments/1gkxdqe/comment/m19kxgn/
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
