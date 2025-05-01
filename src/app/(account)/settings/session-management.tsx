"use client";

import { useActionState } from "react";
import { Alert } from "~/components/simple/Alert";
import { Button } from "~/components/simple/Button";
import { Geolocation } from "~/components/simple/Geolocation";
import { Heading } from "~/components/simple/Heading";
import * as Menu from "~/components/simple/Menu";
import { ActionState, StatefulAction } from "~/lib/actions";
import { Session } from "~/lib/db";
import { fmt } from "~/lib/fmt";

export function SessionManagement<T extends ActionState>({
  sessions,
  ...props
}: {
  sessions: Session[];
  action: StatefulAction<{ id: number }, T>;
}) {
  const [state, invalidate, pending] = useActionState(
    props.action,
    undefined as Awaited<T>
  );

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <Heading variant="small" asChild>
          <h2>Sessions</h2>
        </Heading>
        <p>
          Check out your session history and invalidate your active sessions.
        </p>
      </header>

      <Alert state={state} />

      <Menu.List>
        {sessions.map((session) => (
          <Menu.Item key={session.id} className="justify-between gap-6">
            <p>
              Created at{" "}
              {fmt.datetime(session.createdAt, {
                dateStyle: "short",
                timeStyle: "short",
              })}
              , from <Geolocation ip={session.ip} />, on{" "}
              {fmt.userAgent(session.userAgent)}.{" "}
              {session.expired ? "Expired" : "Expires"} on{" "}
              {fmt.datetime(session.expiresAt, {
                dateStyle: "short",
                timeStyle: "short",
              })}
              .
            </p>

            {session.expired ? null : (
              <aside>
                <Button
                  size="small"
                  variant="secondary"
                  disabled={pending}
                  onClick={() => invalidate({ id: session.id })}
                >
                  Invalidate
                </Button>
              </aside>
            )}
          </Menu.Item>
        ))}
      </Menu.List>
    </section>
  );
}
