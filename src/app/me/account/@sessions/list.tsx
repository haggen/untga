"use client";

import { useActionState } from "react";
import { Alert } from "~/components/simple/Alert";
import { Button } from "~/components/simple/Button";
import { Geolocation } from "~/components/simple/Geolocation";
import * as Menu from "~/components/simple/Menu";
import { ActionState, StatefulAction } from "~/lib/actions";
import { Session } from "~/lib/db";
import { fmt } from "~/lib/fmt";

export function List<T extends ActionState>({
  sessions,
  ...props
}: {
  sessions: Session[];
  invalidate: StatefulAction<{ id: number }, T>;
}) {
  const [state, invalidate, pending] = useActionState(
    props.invalidate,
    undefined as Awaited<T>
  );

  return (
    <>
      <Alert state={state} />

      <Menu.List>
        {sessions.map((session) => (
          <Menu.Item key={session.id} className="gap-3">
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
    </>
  );
}
