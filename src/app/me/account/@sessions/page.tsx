import { Heading } from "~/components/heading";
import { createStatefulAction } from "~/lib/actions";
import { db } from "~/lib/db";
import { serialize } from "~/lib/serializable";
import { ensureActiveSession } from "~/lib/session";
import { List } from "./list";

export default async function Page() {
  const session = await ensureActiveSession(true);

  const sessions = await db.session.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  const invalidate = createStatefulAction(async (payload: { id: number }) => {
    "use server";

    const session = await ensureActiveSession(true);

    await db.session.invalidate({
      where: {
        id: payload.id,
        user: { id: session.userId },
      },
    });

    return { message: "Session invalidated." };
  });

  return (
    <section className="flex flex-col gap-6 p-section">
      <header className="flex flex-col gap-2">
        <Heading size="small" asChild>
          <h1>Sessions</h1>
        </Heading>
        <p>
          Check out your session history and invalidate your active sessions.
        </p>
      </header>

      <List sessions={serialize(sessions)} invalidate={invalidate} />
    </section>
  );
}
