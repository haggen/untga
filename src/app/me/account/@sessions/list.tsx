"use client";

import { Fragment, Suspense, useActionState } from "react";
import { alert } from "~/components/alert";
import { Button } from "~/components/button";
import { Geolocation, useGeolocation } from "~/components/geolocation";
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
    <li>
      <p>
        Created on{" "}
        {fmt.datetime(session.createdAt, {
          dateStyle: "short",
          timeStyle: "short",
        })}
        , from{" "}
        <Suspense fallback="···">
          <Geolocation data={geolocation} />
        </Suspense>
        , on {fmt.userAgent(session.userAgent)}.
      </p>
      {session.expired ? null : (
        <aside className="flex items-center justify-between">
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
            onClick={() => invalidate()}
          >
            Invalidate
          </Button>
        </aside>
      )}
    </li>
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
      {alert(state)}

      <ul className="flex flex-col gap-3">
        {sessions.map((session) => (
          <Item
            key={session.id}
            session={session}
            pending={pending}
            invalidate={invalidate.bind(null, { id: session.id })}
          />
        ))}
      </ul>
    </Fragment>
  );
}
