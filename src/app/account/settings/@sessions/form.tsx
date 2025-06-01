"use client";

import { useActionState } from "react";
import { alert } from "~/components/alert";
import { Button } from "~/components/button";
import { Session } from "~/db";
import { ActionState, StatefulAction } from "~/lib/actions";
import { fmt } from "~/lib/fmt";
import { Serializable } from "~/lib/serializable";

export function Form({
  sessions,
  ...props
}: {
  sessions: Serializable<Session[]>;
  invalidate: StatefulAction<{ id: number }, ActionState>;
}) {
  const [state, invalidate, pending] = useActionState(
    props.invalidate,
    undefined as Awaited<ActionState>
  );

  return (
    <form>
      {alert(state)}

      <ul className="flex flex-col gap-3">
        {sessions.map((session) => (
          <li key={session.id}>
            <p>
              Created on{" "}
              {fmt.datetime(session.createdAt, {
                dateStyle: "short",
                timeStyle: "short",
              })}
              , from {session.geolocation}, on{" "}
              {fmt.userAgent(session.userAgent)}.
            </p>
            {session.expired ? null : (
              <footer className="flex items-center justify-between">
                <p className="text-xs">
                  Expires on{" "}
                  {fmt.datetime(session.expiresAt, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                  .
                </p>
                <Button
                  size="small"
                  variant="alternate"
                  disabled={pending}
                  formAction={invalidate.bind(null, { id: session.id })}
                >
                  Invalidate
                </Button>
              </footer>
            )}
          </li>
        ))}
      </ul>
    </form>
  );
}
