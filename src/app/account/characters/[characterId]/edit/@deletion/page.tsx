import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Heading } from "~/components/heading";
import { db } from "~/db";
import { createStatefulAction } from "~/lib/actions";
import { serializable } from "~/lib/serializable";
import { ensureActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";
import { Form } from "./form";

export default async function Page({ params }: { params: Promise<unknown> }) {
  const { characterId } = parse(await params, {
    characterId: schemas.id,
  });

  const session = await ensureActiveSession(true);

  const character = await db.character.findUniqueOrThrow({
    where: { id: characterId, userId: session.userId },
  });

  const action = createStatefulAction(async (payload: FormData) => {
    "use server";

    const session = await ensureActiveSession();

    const data = parse(payload, {
      characterId: schemas.id,
    });

    await db.character.update({
      where: { id: data.characterId, userId: session.userId },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/account/characters");
    redirect("/account/characters");
  });

  return (
    <section className="flex flex-col gap-block p-section">
      <header className="flex flex-col gap-text">
        <Heading size="small" asChild>
          <h2>Delete your character</h2>
        </Heading>
        <p>
          By clicking on the button below you agree to have this
          character&apos;s data and progression be irrevocably purged from our
          system.
        </p>
      </header>

      <Form value={serializable(character)} action={action} />
    </section>
  );
}
