import { Alert } from "@/components/Alert";
import { Field } from "@/components/Field";
import { Form } from "@/components/Form";
import { Input } from "@/components/Input";
import { Stack } from "@/components/Stack";
import { Submit } from "@/components/Submit";
import prisma from "@/lib/prisma";
import { setSessionCookie } from "@/lib/session";
import { parse } from "@/lib/validation";
import bcrypt from "bcrypt";
import { DateTime } from "luxon";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
});

export default function Page() {
  const action = async (state: { error: string }, payload: FormData) => {
    "use server";

    try {
      const { data, error } = parse(payload, schema);

      if (error) {
        throw error;
      }

      const user = await prisma.user.findFirstOrThrow({
        where: { email: data.email },
      });

      if (!(await bcrypt.compare(data.password, user.password))) {
        throw new Error("Password doesn't match");
      }

      const session = await prisma.session.create({
        data: {
          user: { connect: { id: user.id } },
          expiresAt: DateTime.now().plus({ hour: 24 }).toJSDate(),
        },
      });

      await setSessionCookie(session);
    } catch (err) {
      console.error(err);
      return { error: JSON.stringify(err) };
    }

    redirect("/");
  };
  return (
    <main className="w-96">
      <Stack asChild>
        <Form action={action}>
          <Stack level={3}>
            <h1 className="text-2xl font-bold">Sign in</h1>
            <p>Enter your registered e-mail and password.</p>
          </Stack>

          <Alert type="error" />

          <Stack level={2} asChild>
            <fieldset>
              <Field label="E-mail" name="email">
                <Input type="email" required />
              </Field>

              <Field label="Password" name="password">
                <Input type="password" minLength={12} required />
              </Field>
            </fieldset>
          </Stack>

          <footer>
            <Submit>Sign in</Submit>
          </footer>
        </Form>
      </Stack>
    </main>
  );
}
