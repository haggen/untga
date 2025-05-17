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
    include: { attributes: { include: { spec: true } }, location: true },
  });

  const logs = await db.log.findMany({
    where: {
      character: { id: protagonistId, user: { id: session.userId } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col grow">
      <Header character={protagonist} />

      <section className="flex flex-col gap-text p-section">
        <header className="flex items-center gap-6">
          <Heading size="small" asChild>
            <h1>Journal</h1>
          </Heading>

          {/* <Button variant="alternate" size="small">
            Write entry
          </Button> */}
        </header>

        <ul className="flex flex-col gap-item">
          {logs.map((log) => (
            <li key={log.id} className="flex flex-col">
              <p>{log.message}</p>

              <p className="text-xs">
                Written on{" "}
                {fmt.datetime(log.createdAt, {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
                .
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
