import { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as Definition from "~/components/definition";
import { Heading } from "~/components/heading";
import { createStatefulAction } from "~/lib/actions";
import { db } from "~/lib/db";
import { fmt } from "~/lib/fmt";
import { ensureActiveSession } from "~/lib/session";
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

export default async function Page({ params }: { params: Promise<unknown> }) {
  const { protagonistId, locationId } = parse(await params, {
    protagonistId: schemas.id,
    locationId: schemas.id,
  });

  // const session = await ensureActiveSession(true);

  // const protagonist = await db.character.findUniqueOrThrow({
  //   where: { id: protagonistId, user: { id: session.user.id } },
  // });

  const location = await db.location.findUniqueOrThrow({
    where: { id: locationId },
    include: {
      _count: {
        select: { characters: true },
      },
    },
  });

  const travel = createStatefulAction(
    async ({
      characterId,
      destinationId,
    }: {
      characterId: number;
      destinationId: number;
    }) => {
      "use server";

      const session = await ensureActiveSession();

      await db.character.findUniqueOrThrow({
        where: { id: characterId, user: { id: session.user.id } },
      });

      await db.character.travel({
        data: {
          characterId,
          destinationId,
        },
      });

      revalidatePath(`/play/${characterId}/location`);
      redirect(`/play/${characterId}/location`);
    }
  ).bind(null, undefined, {
    characterId: protagonistId,
    destinationId: locationId,
  });

  return (
    <div className="grow flex flex-col">
      <div className="flex flex-col gap-2 p-section">
        <Heading size="large" asChild>
          <h1>{location.name}</h1>
        </Heading>

        <p>{location.description || "No description available."}</p>

        <Definition.List>
          <Definition.Item label="Security">
            {fmt.location.security(location.security)}
          </Definition.Item>
          <Definition.Item label="Area">
            {fmt.number(location.area, {
              unit: "mile",
              style: "unit",
            })}
          </Definition.Item>
          <Definition.Item label="Population">
            {fmt.plural(location._count.characters, {
              one: "# person",
              other: "# people",
              zero: "Empty",
            })}
          </Definition.Item>
        </Definition.List>
      </div>

      <Form travel={travel} />
    </div>
  );
}
