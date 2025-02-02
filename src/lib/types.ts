export type Action<State = { error: string }, Payload = FormData> = (
  state: State,
  payload: Payload
) => Promise<State>;
