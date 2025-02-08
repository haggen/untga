import { Alert } from "@/components/Alert";
import { Field } from "@/components/Field";
import { Form } from "@/components/Form";
import { Input } from "@/components/Input";
import { Stack } from "@/components/Stack";
import { Submit } from "@/components/Submit";
import { createStatefulAction } from "@/lib/actions";
import { db } from "@/lib/database";
import { setActiveSession } from "@/lib/session";
import { parse, schema } from "@/lib/validation";
import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<object>;
  searchParams: Promise<object>;
};

export async function generateMetadata(
  {}: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { title } = await parent;
  return {
    title: `Registration at ${title}`,
  };
}

export default async function Page({}: Props) {
  const action = createStatefulAction(async (payload: FormData) => {
    "use server";

    const data = parse(payload, {
      email: schema.email,
      password: schema.password,
    });

    const user = await db.user.create({
      data: {
        email: data.email,
        password: data.password,
      },
    });

    const session = await db.session.create({
      data: { userId: user.id },
    });

    await setActiveSession(session);

    redirect("/characters/create");
  });

  return (
    <main>
      <Stack asChild>
        <Form action={action}>
          <Stack level={3}>
            <h1 className="text-2xl font-bold">Registration</h1>

            <p>
              Welcome! To start your journey first you have to create an
              account.
            </p>
          </Stack>

          <Alert />

          <Stack level={2} asChild>
            <fieldset>
              <Field label="E-mail" name="email">
                <Input
                  type="email"
                  placeholder="e.g. me@example.com"
                  required
                />
              </Field>
              <Field
                label="Password"
                name="password"
                hint="At least 12 characters."
              >
                <Input
                  type="password"
                  placeholder="e.g. super-duper-secret"
                  minLength={12}
                  required
                />
              </Field>
            </fieldset>
          </Stack>

          <footer>
            <Submit>Register</Submit>
          </footer>
        </Form>
      </Stack>
    </main>
  );
}
