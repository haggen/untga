import { Metadata } from "next";
import { redirect } from "next/navigation";
import z from "zod";
import { Heading } from "~/components/heading";
import { createStatefulAction } from "~/lib/actions";
import { db } from "~/lib/db";
import { ensureActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";
import { Form } from "./form";

export const metadata: Metadata = {
  title: "Create new character",
};

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

    redirect(`/play/${character.id}/stats`);
  });

  return (
    <div className="grow flex flex-col">
      <header className="flex flex-col gap-2 p-section">
        <Heading size="large" asChild>
          <h1>New character</h1>
        </Heading>
        <p>
          Enter your character&apos;s details below. This is how you&apos;ll be
          known in this world.
        </p>
      </header>

      <Form action={action} />
    </div>
  );
}
