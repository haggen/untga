import { Heading } from "~/components/heading";
import { createStatefulAction } from "~/lib/actions";
import { db } from "~/lib/db";
import { ensureActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";
import { Form } from "./form";

export default async function Page() {
  const action = createStatefulAction(async (payload: FormData) => {
    "use server";

    const session = await ensureActiveSession(true);

    const data = parse(payload, {
      email: schemas.email,
    });

    await db.user.update({
      where: { id: session.userId },
      data: { email: data.email },
    });

    return { message: "Email changed successfully." };
  });

  return (
    <section className="flex flex-col gap-9 p-section">
      <header className="flex flex-col gap-2">
        <Heading size="small" asChild>
          <h1>Change your e-mail</h1>
        </Heading>
        <p>
          Type your new e-mail in the input below and confirm. You&apos;ll
          receive an additional e-mail verification message in your inbox.
        </p>
      </header>

      <Form action={action} />
    </section>
  );
}
