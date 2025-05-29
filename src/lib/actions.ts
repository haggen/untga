import { isRedirectError } from "next/dist/client/components/redirect-error";

/**
 * Payload of a server action.
 */
export type ActionPayload = FormData | Record<string, unknown>;

/**
 * State of a server action.
 */
export type ActionState = { error: string } | { message: string } | undefined;

/**
 * Action produced by useActionState.
 */
export type StatefulAction<P, S> = (state: S, payload: P) => Promise<S>;

/**
 * Server action.
 */
export type StatelessAction<P> = (payload?: P) => void;

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
  action: (payload: P) => Promise<ActionState>
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
