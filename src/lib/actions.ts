import { isRedirectError } from "next/dist/client/components/redirect-error";

export type ActionPayload = FormData | Record<string, unknown>;

export type ActionState = { error: string } | { message: string } | void;

export type StatefulAction<P, T> = (state: T, payload: P) => Promise<T>;

export type StatelessAction<P, T> = (payload: P) => Promise<T>;

export function handleActionError(err: unknown) {
  if (isRedirectError(err)) {
    throw err;
  }

  if (err instanceof Error) {
    return { error: err.message };
  }

  return { error: JSON.stringify(err) };
}

export function createStatefulAction<
  P extends ActionPayload,
  T extends ActionState
>(action: StatelessAction<P, T>) {
  return async (_: T, payload: P): Promise<T> => {
    "use server";

    try {
      return await action(payload);
    } catch (err) {
      return handleActionError(err) as T;
    }
  };
}
