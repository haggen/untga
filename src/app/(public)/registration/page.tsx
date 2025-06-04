import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { Heading } from "~/components/heading";
import { db } from "~/db";
import { createStatefulAction } from "~/lib/actions";
import { getGeolocation } from "~/lib/geolocation";
import { getRemoteAddr, getUserAgent } from "~/lib/request";
import { setSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";
import { Form } from "./form";

export const metadata: Metadata = {
  title: "Registration",
};

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

    const ip = getRemoteAddr(await headers());

    const session = await db.session.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        userAgent: getUserAgent(await headers()),
        ip,
      },
    });

    await setSession(session);

    after(async () => {
      await db.session.update({
        where: { id: session.id },
        data: { geolocation: await getGeolocation(ip) },
      });
    });

    redirect("/account/characters");
  });

  return (
    <div className="flex flex-col">
      <header className="flex flex-col gap-2 p-section">
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
