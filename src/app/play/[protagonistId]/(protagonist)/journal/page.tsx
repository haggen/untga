import { Metadata } from "next";
import { Heading } from "~/components/heading";
import { Header } from "~/components/protagonist";
import { db } from "~/lib/db";
import { fmt } from "~/lib/fmt";
import { ensureActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";

export const metadata: Metadata = {
  title: "Character's journal",
};

export default async function Page({
  params,
}: Readonly<{
  params: Promise<unknown>;
}>) {
  const { protagonistId } = parse(await params, {
    protagonistId: schemas.id,
  });

  const session = await ensureActiveSession();

  const protagonist = await db.character.findUniqueOrThrow({
    where: { id: protagonistId, user: { id: session.userId } },
  });

  const logs = await db.log.findMany({
    where: {
      character: { id: protagonistId, user: { id: session.userId } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grow flex flex-col gap-12">
      <Header character={protagonist} />

      <section className="flex flex-col gap-3">
        <Heading size="small" asChild>
          <h1>Journal</h1>
        </Heading>

        <ul className="flex flex-col gap-1.5">
          {logs.map((log) => (
            <li key={log.id} className="flex gap-1.5">
              <article>
                <h1 className="text-sm text-stone-600">
                  {fmt.datetime(log.createdAt, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </h1>

                <p>{log.message}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
