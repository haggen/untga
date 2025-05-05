import { Heading } from "~/components/heading";
import { createStatefulAction } from "~/lib/actions";
import { db } from "~/lib/db";
import { ensureActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";
import { Form } from "./form";

export default async function Page() {
  const changePassword = createStatefulAction(async (payload: FormData) => {
    "use server";

    const session = await ensureActiveSession(true);

    const data = parse(payload, {
      password: schemas.password,
    });

    await db.user.update({
      where: { id: session.userId },
      data: { password: data.password },
    });

    return { message: "Password changed successfully." };
  });

  return (
    <section className="flex flex-col gap-9">
      <header className="flex flex-col gap-1.5">
        <Heading size="small" asChild>
          <h2>Change your password</h2>
        </Heading>
        <p>Type your new password in the input below and confirm.</p>
      </header>

      <Form action={changePassword} />
    </section>
  );
}
