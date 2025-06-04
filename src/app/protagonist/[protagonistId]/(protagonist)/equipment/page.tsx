import { Metadata } from "next";
import * as Definition from "~/components/definition";
import { Heading } from "~/components/heading";
import { Link } from "~/components/link";
import { Header } from "~/components/protagonist/header";
import { db } from "~/db";
import { ensure } from "~/lib/ensure";
import { fmt } from "~/lib/fmt";
import { ensureSession } from "~/lib/session";
import { tag } from "~/lib/tag";
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

  const session = await ensureSession(true);

  const protagonist = await db.character.findUniqueOrThrow({
    where: { id: protagonistId, userId: session.userId },
    include: {
      attributes: { include: { spec: true } },
      location: true,
    },
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
    tag.Head,
    tag.Overgarment,
    tag.Torso,
    tag.Waist,
    tag.Hands,
    tag.Legs,
    tag.Feet,
    tag.Pack,
  ].map((tag) =>
    ensure(
      containers.find((container) => container.tags.includes(tag)),
      `Could not find slot: ${tag}.`
    )
  );

  const storage = containers.filter((container) =>
    container.items.some((item) => item.spec.tags.includes(tag.Storage))
  );

  return (
    <div className="flex flex-col grow">
      <Header character={protagonist} />

      <section className="flex flex-col gap-text p-section">
        <Heading size="small" asChild>
          <h1>Equipment</h1>
        </Heading>

        <Definition.List>
          {slots.map((slot) => (
            <Link
              key={slot.id}
              href={
                slot.items[0]
                  ? `/protagonist/${protagonistId}/items/${slot.items[0].id}`
                  : ""
              }
            >
              <Definition.Item
                label={fmt.string(String(slot.slot), { title: true })}
              >
                {slot.items[0]?.spec.name ?? "Empty"}
              </Definition.Item>
            </Link>
          ))}
        </Definition.List>
      </section>

      {storage.map((container) => (
        <section
          key={container.id}
          className="flex flex-col gap-text p-section"
        >
          <Heading size="small" asChild>
            <h1>{container.items[0]?.spec.name}</h1>
          </Heading>

          <p>{container.items[0]?.spec.description}</p>

          <Definition.List>
            {container.items[0]?.storage?.items.map((item) => (
              <Link
                key={item.id}
                href={`/protagonist/${protagonistId}/items/${item.id}`}
              >
                <Definition.Item label={item.spec.name}>
                  &times;{item.amount}
                </Definition.Item>
              </Link>
            ))}
          </Definition.List>
        </section>
      ))}
    </div>
  );
}
