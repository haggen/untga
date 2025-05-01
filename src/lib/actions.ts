import { isRedirectError } from "next/dist/client/components/redirect-error";

export type ActionPayload = FormData | Record<string, unknown>;

export type ActionState = { error: string } | { message: string } | void;

export type StatefulAction = (
  state: ActionState,
  payload: FormData
) => Promise<ActionState>;

export type StatelessAction = (payload: FormData) => Promise<ActionState>;

export function handleActionError(err: unknown) {
  if (isRedirectError(err)) {
    throw err;
  }
  if (err instanceof Error) {
    return { error: err.message };
  }
  return { error: JSON.stringify(err) };
}

export function createStatefulAction(action: StatelessAction) {
  return async (_: ActionState, payload: FormData): Promise<ActionState> => {
    "use server";

    try {
      return await action(payload);
    } catch (err) {
      return handleActionError(err);
    }
  };
}
