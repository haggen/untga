import { createCharacter } from "@/actions";
import { Alert } from "@/components/Alert";
import { Field } from "@/components/Field";
import { Form } from "@/components/Form";
import { Input } from "@/components/Input";
import { Stack } from "@/components/Stack";
import { Submit } from "@/components/Submit";
import { createStatefulAction } from "@/lib/actions";
import * as schema from "@/lib/schema";
import { requireActiveSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Page() {
  await requireActiveSession();

  const action = createStatefulAction(async (payload: FormData) => {
    "use server";
    const session = await requireActiveSession();
    const character = await createCharacter({
      userId: session.userId,
      name: schema.name.parse(payload.get("name")),
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

          <Alert type="error" />

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
