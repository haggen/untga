import { Heading } from "~/components/simple/Heading";
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
      characterId: schemas.id,
    });

    await db.character.update({
      where: { id: data.characterId, userId: session.userId },
      data: { deletedAt: new Date() },
    });

    return { message: "Character deleted." };
  });

  return (
    <section className="flex flex-col gap-9">
      <header className="flex flex-col gap-1.5">
        <Heading size="small" asChild>
          <h2>Delete your character</h2>
        </Heading>
        <p>
          By clicking on the button below you agree to have this
          character&apos;s data and progression be irrevocably purged from our
          system.
        </p>
      </header>

      <Form action={action} />
    </section>
  );
}
