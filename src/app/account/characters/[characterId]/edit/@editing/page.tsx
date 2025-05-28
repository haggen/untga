import { revalidatePath } from "next/cache";
import { Heading } from "~/components/heading";
import { createStatefulAction } from "~/lib/actions";
import { db } from "~/lib/db";
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
      description: schemas.description,
    });

    await db.character.update({
      where: { id: data.characterId, userId: session.userId },
      data: { description: data.description },
    });

    revalidatePath("/play/[characterId]/(protagonist)/edit/@editing");

    return { message: "Character updated successfully." };
  });

  return (
    <section className="flex flex-col">
      <header className="flex flex-col gap-text p-section">
        <Heading size="large" asChild>
          <h1>Edit character</h1>
        </Heading>

        <p>
          You can change some of your character&apos;s details below. This is
          how you&apos;re known in the world.
        </p>
      </header>

      <Form action={action} value={serializable(character)} />
    </section>
  );
}
