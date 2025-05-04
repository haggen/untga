"use client";

import { Fragment, Suspense, useActionState } from "react";
import { Alert } from "~/components/Alert";
import { Button } from "~/components/Button";
import { Geolocation, useGeolocation } from "~/components/Geolocation";
import * as Menu from "~/components/Menu";
import { ActionState, StatefulAction } from "~/lib/actions";
import { Session } from "~/lib/db";
import { fmt } from "~/lib/fmt";
import { Serialized } from "~/lib/serializable";

function Item({
  session,
  pending,
  invalidate,
}: {
  session: Serialized<Session>;
  pending: boolean;
  invalidate: () => void;
}) {
  const geolocation = useGeolocation(session.ip);

  return (
    <Menu.Item key={session.id} className="gap-1.5">
      <p>
        Created at{" "}
        {fmt.datetime(session.createdAt, {
          dateStyle: "short",
          timeStyle: "short",
        })}
        , from{" "}
        <Suspense fallback="···">
          <Geolocation data={geolocation} />
        </Suspense>
        , on {fmt.userAgent(session.userAgent)}.{" "}
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
            onClick={() => invalidate()}
          >
            Invalidate
          </Button>
        </aside>
      )}
    </Menu.Item>
  );
}

export function List<T extends ActionState>({
  sessions,
  ...props
}: {
  sessions: Serialized<Session[]>;
  invalidate: StatefulAction<{ id: number }, T>;
}) {
  const [state, invalidate, pending] = useActionState(
    props.invalidate,
    undefined as Awaited<T>
  );

  return (
    <Fragment>
      <Alert state={state} />

      <Menu.List>
        {sessions.map((session) => (
          <Item
            key={session.id}
            session={session}
            pending={pending}
            invalidate={invalidate.bind(null, { id: session.id })}
          />
        ))}
      </Menu.List>
    </Fragment>
  );
}
