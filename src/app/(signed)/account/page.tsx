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
import { z } from "zod";

export default async function Page() {
  const session = await requireActiveSession();
  const user = await db.user.findUniqueOrThrow({
    where: { id: session.userId },
  });

  const action = createStatefulAction(async (payload: FormData) => {
    "use server";

    const session = await requireActiveSession();

    const data = parse(payload, {
      email: schema.email,
      password: schema.password.or(z.literal("").transform(() => undefined)),
    });

    await db.user.update({
      where: { id: session.userId },
      data: {
        email: data.email,
        password: data.password,
      },
    });

    return { message: "Account information saved." };
  });

  return (
    <main>
      <Stack asChild>
        <Form action={action}>
          <Stack level={3}>
            <h1 className="text-2xl font-bold">Account</h1>

            <p>Here you can change your e-mail or password.</p>
          </Stack>

          <Alert />

          <Stack level={2} asChild>
            <fieldset>
              <Field label="E-mail" name="email">
                <Input
                  type="email"
                  placeholder="e.g. me@example.com"
                  defaultValue={user.email}
                  required
                />
              </Field>
              <Field
                label="New password"
                name="password"
                hint="At least 12 characters. Leave it blank to keep using the same password."
              >
                <Input
                  type="password"
                  placeholder="e.g. super-duper-secret"
                  minLength={12}
                  autoComplete="off"
                />
              </Field>
            </fieldset>
          </Stack>

          <footer>
            <Submit>Save</Submit>
          </footer>
        </Form>
      </Stack>
    </main>
  );
}
