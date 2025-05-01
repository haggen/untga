import { redirect } from "next/navigation";
import z from "zod";
import { Heading } from "~/components/simple/Heading";
import { createStatefulAction } from "~/lib/actions";
import { db } from "~/lib/db";
import { ensureActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";
import { Form } from "./form";

export default async function Page() {
  const action = createStatefulAction(async (payload: FormData) => {
    "use server";

    const session = await ensureActiveSession();

    const data = parse(payload, {
      name: schemas.name,
      description: z.string().max(256).optional(),
    });

    const character = await db.character.createPlayer({
      data: {
        userId: session.userId,
        name: data.name,
        description: data.description,
      },
    });

    redirect(`/characters/${character.id}`);
  });

  return (
    <main className="flex flex-col gap-12">
      <header className="flex flex-col gap-1.5">
        <Heading as="h1" variant="large">
          New character
        </Heading>
        <p>
          Enter your character&apos;s details below. This is how you&apos;ll be
          known in this world.
        </p>
      </header>

      <Form action={action} />
    </main>
  );
}
