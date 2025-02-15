import { isRedirectError } from "next/dist/client/components/redirect-error";

export type Payload = FormData | Record<string, unknown>;

export type State = { error: string } | { message: string } | void;

export type StatefulAction<State> = (
  state: State,
  payload: FormData
) => Promise<State>;

export type StatelessAction<Payload, Result> = (
  payload: Payload
) => Promise<Result>;

export function handleError(err: unknown) {
  if (isRedirectError(err)) {
    throw err;
  }
  if (err instanceof Error) {
    return { error: err.message };
  }
  return { error: JSON.stringify(err) };
}

export function createStatefulAction(
  action: (payload: FormData) => Promise<State>
) {
  return async (_: State, payload: FormData): Promise<State> => {
    "use server";

    try {
      return await action(payload);
    } catch (err) {
      return handleError(err);
    }
  };
}
