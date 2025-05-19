import { Metadata } from "next";
import { Heading } from "~/components/heading";
import { createStatefulAction } from "~/lib/actions";
import { parse, schemas } from "~/lib/validation";
import { Form } from "./form";

export const metadata: Metadata = {
  title: "Recovery",
};

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
    <div className="flex flex-col">
      <header className="flex flex-col gap-2 p-section">
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
    </div>
  );
}
