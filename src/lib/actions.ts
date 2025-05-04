import { isRedirectError } from "next/dist/client/components/redirect-error";

export type ActionPayload = FormData | Record<string, unknown>;

export type ActionState = { error: string } | { message: string } | undefined;

export type StatefulAction<P, S> = (state: S, payload: P) => Promise<S>;

export type StatelessAction<P, S> = (payload?: P) => Promise<S> | S;

export function handleActionError(err: unknown) {
  if (isRedirectError(err)) {
    throw err;
  }

  if (err instanceof Error) {
    return { error: err.message };
  }

  return { error: JSON.stringify(err) };
}

export function createStatefulAction<P, S extends ActionState>(
  action: (payload: P) => Promise<S>
) {
  return async (_: ActionState, payload: P): Promise<ActionState> => {
    "use server";

    try {
      return await action(payload);
    } catch (err) {
      return handleActionError(err);
    }
  };
}
