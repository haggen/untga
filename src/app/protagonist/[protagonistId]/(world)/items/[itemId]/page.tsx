import { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as Definition from "~/components/definition";
import { Heading } from "~/components/heading";
import { db } from "~/db";
import { createStatefulAction } from "~/lib/actions";
import { fmt } from "~/lib/fmt";
import { serializable } from "~/lib/serializable";
import { ensureActiveSession } from "~/lib/session";
import { tag } from "~/lib/tags";
import { parse, schemas } from "~/lib/validation";
import { Form } from "./form";

export async function generateMetadata({
  params,
}: {
  params: Promise<unknown>;
}): Promise<Metadata> {
  const { itemId } = parse(await params, {
    itemId: schemas.id,
  });

  const item = await db.item.findUniqueOrThrow({
    where: { id: itemId },
    include: { spec: true },
  });

  return { title: item.spec.name };
}

export default async function Page({ params }: { params: Promise<unknown> }) {
  const { protagonistId, itemId } = parse(await params, {
    protagonistId: schemas.id,
    itemId: schemas.id,
  });

  const session = await ensureActiveSession(true);

  const protagonist = await db.character.findUniqueOrThrow({
    where: { id: protagonistId, user: { id: session.user.id } },
    include: {
      slots: {
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
      },
    },
  });

  const item = await db.item.findUniqueOrThrow({
    where: { id: itemId },
    include: { spec: true },
  });

  const action = createStatefulAction(
    async ({
      action,
      characterId,
      itemId,
    }: {
      action: string;
      characterId: number;
      itemId: number;
    }) => {
      "use server";

      const session = await ensureActiveSession();

      await db.character
        .findUniqueOrThrow({
          where: { id: characterId, user: { id: session.user.id } },
        })
        .catch((cause) => {
          throw new Error("You are not allowed to do that.", { cause });
        });

      switch (action) {
        case "use":
          await db.item.use({
            data: { itemId, characterId },
          });
          break;
        case "equip":
          await db.character.equip({
            data: {
              characterId,
              itemId,
            },
          });
          break;
        case "unequip":
          await db.character.unequip({
            data: {
              characterId,
              itemId,
            },
          });
          break;
        case "discard":
          await db.item.discard({
            data: { itemId },
          });
          break;
        default:
          throw new Error("Unknown action.");
      }

      revalidatePath(`/protagonist/${characterId}/equipment`);
      redirect(`/protagonist/${characterId}/equipment`);
    }
  );

  return (
    <div className="flex flex-col grow">
      <div className="flex flex-col gap-text p-section">
        <Heading size="large" asChild>
          <h1>{item.spec.name}</h1>
        </Heading>

        <p>{item.spec.description}</p>

        <Definition.List>
          {item.spec.tags.includes(tag.Craftable) ? (
            <Definition.Item label="Quality">
              {fmt.item.quality(item.spec.quality)}
            </Definition.Item>
          ) : null}
          {item.spec.tags.includes(tag.Breakable) ? (
            <Definition.Item label="Durability">
              {fmt.item.durability(item.durability)}
            </Definition.Item>
          ) : null}
          {item.spec.tags.includes(tag.Stackable) ? (
            <Definition.Item label="Amount">
              {fmt.item.amount(item.amount)}
            </Definition.Item>
          ) : null}
        </Definition.List>
      </div>

      <Form
        action={action}
        protagonist={serializable(protagonist)}
        item={serializable(item)}
      />
    </div>
  );
}
