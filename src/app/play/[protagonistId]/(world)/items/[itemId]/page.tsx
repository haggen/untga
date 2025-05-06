import { Metadata } from "next";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Heading } from "~/components/heading";
import { createStatefulAction } from "~/lib/actions";
import { db } from "~/lib/db";
import { serialize } from "~/lib/serializable";
import { ensureActiveSession } from "~/lib/session";
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

  const equip = createStatefulAction(
    async ({
      characterId,
      itemId,
    }: {
      characterId: number;
      itemId: number;
    }) => {
      "use server";

      const session = await ensureActiveSession();

      await db.character.findUniqueOrThrow({
        where: { id: characterId, user: { id: session.user.id } },
      });

      await db.character.equip({
        data: {
          characterId,
          itemId,
        },
      });

      revalidatePath(`/play/${characterId}/equipment`);
      redirect(`/play/${characterId}/equipment`);
    }
  ).bind(null, undefined, {
    characterId: protagonistId,
    itemId: itemId,
  });

  const unequip = createStatefulAction(
    async ({
      characterId,
      itemId,
    }: {
      characterId: number;
      itemId: number;
    }) => {
      "use server";

      const session = await ensureActiveSession();

      await db.character.findUniqueOrThrow({
        where: { id: characterId, user: { id: session.user.id } },
      });

      await db.character.unequip({
        data: {
          characterId,
          itemId,
        },
      });

      revalidatePath(`/play/${characterId}/equipment`);
      redirect(`/play/${characterId}/equipment`);
    }
  ).bind(null, undefined, {
    characterId: protagonistId,
    itemId: itemId,
  });

  return (
    <div className="grow flex flex-col gap-12">
      <header>
        <Image
          src="/bag.png"
          alt="A bag with a question mark on the side."
          width={702}
          height={702}
          className="w-full mix-blend-color-burn"
        />

        <div className="flex flex-col gap-1.5">
          <Heading size="large" asChild>
            <h1>{item.spec.name}</h1>
          </Heading>

          <p>{item.spec.description}</p>
        </div>
      </header>

      <Form
        equip={equip}
        unequip={unequip}
        protagonist={serialize(protagonist)}
        item={serialize(item)}
      />
    </div>
  );
}
