import { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Heading } from "~/components/heading";
import { Summary } from "~/components/item/summary";
import { db } from "~/db";
import { game } from "~/game";
import { createStatefulAction } from "~/lib/actions";
import { serializable } from "~/lib/serializable";
import { ensureSession } from "~/lib/session";
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

  const session = await ensureSession(true);

  const protagonist = await db.character.findUniqueOrThrow({
    where: { id: protagonistId, user: { id: session.user.id } },
    include: db.character.withEquipment(),
  });

  const item = await db.item.findUniqueOrThrow({
    where: { id: itemId },
    include: { spec: true },
  });

  const action = createStatefulAction(
    async ({
      tags,
      characterId,
      params,
    }: {
      tags: string[];
      characterId: number;
      params: { itemId: number };
    }) => {
      "use server";

      const session = await ensureSession();

      await db.character
        .findUniqueOrThrow({
          where: { id: characterId, userId: session.user.id },
        })
        .catch((cause) => {
          throw new Error("You can't do that.", { cause });
        });

      const activity = await db.activity.create({
        data: {
          tags,
          characterId,
          params,
        },
      });

      await game.simulation.handle(activity);

      revalidatePath(`/protagonist/${characterId}`);
      redirect(`/protagonist/${characterId}/equipment`);
    }
  );

  return (
    <div className="flex flex-col grow">
      <div className="flex flex-col gap-text p-section">
        <Heading size="large" asChild>
          <h1>{item.spec.name}</h1>
        </Heading>

        <Summary item={item} />
      </div>

      <Form
        action={action}
        protagonist={serializable(protagonist)}
        item={serializable(item)}
      />
    </div>
  );
}
