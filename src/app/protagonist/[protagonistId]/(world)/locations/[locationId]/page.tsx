import { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Heading } from "~/components/heading";
import { Summary } from "~/components/location/summary";
import { db } from "~/db";
import { game } from "~/game";
import { type Plan } from "~/game/simulation";
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
  const { locationId } = parse(await params, {
    locationId: schemas.id,
  });

  const location = await db.location.findUniqueOrThrow({
    where: { id: locationId },
    select: { name: true },
  });

  return { title: location.name };
}

export default async function Page({
  params,
}: Readonly<{ params: Promise<unknown> }>) {
  const { protagonistId, locationId } = parse(await params, {
    protagonistId: schemas.id,
    locationId: schemas.id,
  });

  const location = await db.location.findUniqueOrThrow({
    where: { id: locationId },
    include: {
      _count: {
        select: { characters: true },
      },
    },
  });

  const action = createStatefulAction(
    async ({ tags, characterId, params }: Plan<{ destinationId: number }>) => {
      "use server";

      const session = await ensureSession();

      await db.character
        .findUniqueOrThrow({
          where: { id: characterId, user: { id: session.user.id } },
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
      redirect(`/protagonist/${characterId}/location`);
    }
  );

  return (
    <div className="grow flex flex-col">
      <div className="flex flex-col gap-2 p-section">
        <Heading size="large" asChild>
          <h1>{location.name}</h1>
        </Heading>

        <Summary location={location} />
      </div>

      <Form
        action={action}
        protagonist={{ id: protagonistId }}
        location={serializable(location)}
      />
    </div>
  );
}
