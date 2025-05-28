import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Heading } from "~/components/heading";
import { createStatefulAction } from "~/lib/actions";
import { db } from "~/lib/db";
import { serializable } from "~/lib/serializable";
import { ensureActiveSession } from "~/lib/session";
import { Form } from "./form";

export default async function Page() {
  const session = await ensureActiveSession(true);

  const sessions = await db.session.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  const invalidate = createStatefulAction(async (payload: { id: number }) => {
    "use server";

    const session = await ensureActiveSession();

    await db.session.invalidate({
      where: {
        id: payload.id,
        user: { id: session.userId },
      },
    });

    if (session.id === payload.id) {
      redirect("/login");
    }

    revalidatePath("/account/settings");

    return { message: "Session invalidated." };
  });

  return (
    <section className="flex flex-col gap-block p-section">
      <header className="flex flex-col gap-text">
        <Heading size="small" asChild>
          <h1>Sessions</h1>
        </Heading>
        <p>
          Check out your session history and invalidate your active sessions.
        </p>
      </header>

      <Form sessions={serializable(sessions)} invalidate={invalidate} />
    </section>
  );
}
