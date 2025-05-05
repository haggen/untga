import { Heading } from "~/components/heading";
import { createStatefulAction } from "~/lib/actions";
import { db } from "~/lib/db";
import { ensureActiveSession } from "~/lib/session";
import { Form } from "./form";

export default async function Page() {
  const action = createStatefulAction(async () => {
    "use server";

    const session = await ensureActiveSession(true);

    await db.user.delete({
      where: { id: session.userId },
    });

    return { message: "Account wiped successfully." };
  });

  return (
    <section className="flex flex-col gap-9">
      <header className="flex flex-col gap-1.5">
        <Heading size="small" asChild>
          <h2>Delete your account</h2>
        </Heading>
        <p>
          By clicking on the button below you agree to have all your data,
          including your characters progression, be wiped from our system. Some
          information, like IP addresses, may take a little longer to be
          completely removed from our logs. This action is irreversible.
        </p>
      </header>

      <Form action={action} />
    </section>
  );
}
