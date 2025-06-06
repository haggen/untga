import { isRedirectError } from "next/dist/client/components/redirect-error";

/**
 * Server action parameters.
 */
export type ActionParams = FormData | Record<string, unknown>;

/**
 * Server action produced state.
 */
export type ActionState = { error: string } | { message: string } | undefined;

/**
 * Server action that produces state.
 */
export type StatefulAction<P, S> = (state: S, params: P) => Promise<S>;

/**
 * Server action that doesn't produce state.
 */
export type StatelessAction<P> = (params?: P) => void;

/**
 * Error handler for server/form actions.
 */
export function handleActionError(err: unknown) {
  if (isRedirectError(err)) {
    throw err;
  }

  if (err instanceof Error) {
    return { error: err.message };
  }

  return { error: JSON.stringify(err) };
}

/**
 * Create a form action from a server action.
 */
export function createStatefulAction<P>(
  action: (params: P) => Promise<ActionState>
) {
  return async (_: ActionState, params: P): Promise<ActionState> => {
    "use server";

    try {
      return await action(params);
    } catch (err) {
      return handleActionError(err);
    }
  };
}
