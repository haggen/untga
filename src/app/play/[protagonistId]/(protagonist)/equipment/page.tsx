import { Metadata } from "next";
import * as Definition from "~/components/definition";
import { Heading } from "~/components/heading";
import { Header } from "~/components/protagonist/header";
import { db } from "~/lib/db";
import { ensure } from "~/lib/ensure";
import { ensureActiveSession } from "~/lib/session";
import { tags } from "~/lib/tags";
import { parse, schemas } from "~/lib/validation";

export const metadata: Metadata = {
  title: "Character's equipment",
};

export default async function Page({
  params,
}: Readonly<{ params: Promise<unknown> }>) {
  const { protagonistId } = parse(await params, {
    protagonistId: schemas.id,
  });

  const session = await ensureActiveSession(true);

  const protagonist = await db.character.findUniqueOrThrow({
    where: { id: protagonistId, userId: session.userId },
  });

  const containers = await db.container.findMany({
    where: {
      character: { id: protagonistId, user: { id: session.userId } },
    },
    include: {
      items: {
        include: {
          spec: true,
          storage: {
            include: {
              items: {
                include: {
                  spec: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const slots = [
    tags.Head,
    tags.Overgarment,
    tags.Torso,
    tags.Waist,
    tags.Hands,
    tags.Legs,
    tags.Pack,
  ].map((tag) => {
    return ensure(
      containers.find((container) => container.tags.includes(tag)),
      `Could not find slot: ${tag}.`
    );
  });

  const storage = containers.filter((container) =>
    container.items.some((item) => item.spec.tags.includes(tags.Storage))
  );

  return (
    <div className="grow flex flex-col gap-12">
      <Header character={protagonist} />

      <section className="flex flex-col gap-1.5">
        <Heading size="small" asChild>
          <h1>Equipment</h1>
        </Heading>

        <Definition.List>
          {slots.map((slot) => (
            <Definition.Item key={slot.id} label={slot.slot}>
              {slot.items[0]?.spec.name ?? "Empty"}
            </Definition.Item>
          ))}
        </Definition.List>
      </section>

      {storage.map((container) => (
        <section key={container.id} className="flex flex-col gap-1.5">
          <Heading size="small" asChild>
            <h1>{container.items[0]?.spec.name}</h1>
          </Heading>

          <Definition.List>
            {container.items[0]?.storage?.items.map((item) => (
              <Definition.Item key={item.id} label={item.spec.name}>
                &times;{item.amount}
              </Definition.Item>
            ))}
          </Definition.List>
        </section>
      ))}
    </div>
  );
}
