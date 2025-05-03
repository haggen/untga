import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Heading } from "~/components/Heading";
import { createStatefulAction } from "~/lib/actions";
import { db } from "~/lib/db";
import { serialize } from "~/lib/serializable";
import { ensureActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";
import { Form } from "./form";

export default async function Page({ params }: { params: Promise<unknown> }) {
  const { protagonistId } = parse(await params, {
    protagonistId: schemas.id,
  });

  const session = await ensureActiveSession(true);

  const protagonist = await db.character.findUniqueOrThrow({
    where: { id: protagonistId, userId: session.userId },
  });

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

    revalidatePath("/me/characters");
    redirect("/me/characters");
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

      <Form value={serialize(protagonist)} action={action} />
    </section>
  );
}
