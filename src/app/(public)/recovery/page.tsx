import { Heading } from "~/components/simple/Heading";
import { createStatefulAction } from "~/lib/actions";
import { parse, schemas } from "~/lib/validation";
import { Form } from "./form";

export default function Page() {
  const action = createStatefulAction(async (payload: FormData) => {
    "use server";

    const data = parse(payload, {
      email: schemas.email,
    });

    console.log(data);

    throw new Error("Not implemented");
  });

  return (
    <main className="flex flex-col gap-12">
      <header className="flex flex-col gap-1.5">
        <Heading size="large" asChild>
          <h1>Recovery</h1>
        </Heading>

        <p>
          Don&apos;t worry, adventurer! We can help you recover your account.
          Type in the e-mail you used to register and we&apos;ll send you a link
          to reset your password.
        </p>
      </header>

      <Form action={action} />
    </main>
  );
}
