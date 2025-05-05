import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Heading } from "~/components/heading";
import { createStatefulAction } from "~/lib/actions";
import { db } from "~/lib/db";
import { getRemoteAddr, getUserAgent } from "~/lib/request";
import { setActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";
import { Form } from "./form";

export default function Page() {
  const action = createStatefulAction(async (payload: FormData) => {
    "use server";

    const data = parse(payload, {
      email: schemas.email,
      password: schemas.password,
    });

    const user = await db.user.create({
      data: {
        email: data.email,
        password: data.password,
      },
    });

    const session = await db.session.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        userAgent: getUserAgent(await headers()),
        ip: getRemoteAddr(await headers()),
      },
    });

    await setActiveSession(session);

    redirect("/me/characters");
  });

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-1.5">
        <Heading size="large" asChild>
          <h1>Registration</h1>
        </Heading>

        <p>
          Welcome, adventurer! Before you can start playing, you&apos;ll need to
          create an account.
        </p>
      </header>

      <Form action={action} />
    </div>
  );
}
