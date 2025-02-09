import { Alert } from "@/components/Alert";
import { Field } from "@/components/Field";
import { Form } from "@/components/Form";
import { Input } from "@/components/Input";
import { Stack } from "@/components/Stack";
import { Submit } from "@/components/Submit";
import { createStatefulAction } from "@/lib/actions";
import db from "@/lib/database";
import { requireActiveSession } from "@/lib/session";
import { parse, schema } from "@/lib/validation";
import { redirect } from "next/navigation";

export default async function Page() {
  await requireActiveSession();

  const action = createStatefulAction(async (payload: FormData) => {
    "use server";

    const session = await requireActiveSession();

    const data = parse(payload, {
      name: schema.name,
    });

    const tick = await db.tick.findFirstOrThrow({
      orderBy: { id: "desc" },
    });

    const character = await db.character.create({
      data: {
        userId: session.userId,
        name: data.name,
        journal: {
          create: {
            writtenAtEpoch: tick.epoch,
            description: "I'm an adult now and I'm on my own.",
          },
        },
      },
    });

    redirect(`/characters/${character.id}`);
  });

  return (
    <main>
      <Stack asChild>
        <Form action={action}>
          <Stack level={3}>
            <h1 className="text-2xl font-bold">Create new character</h1>

            <p>Start by creating your first character.</p>
          </Stack>

          <Alert />

          <Stack level={2} asChild>
            <fieldset>
              <Field label="Character's name" name="name">
                <Input
                  type="text"
                  minLength={3}
                  required
                  placeholder="e.g. Terrence of Williamsburg"
                />
              </Field>
            </fieldset>
          </Stack>

          <footer>
            <Submit>Create</Submit>
          </footer>
        </Form>
      </Stack>
    </main>
  );
}
