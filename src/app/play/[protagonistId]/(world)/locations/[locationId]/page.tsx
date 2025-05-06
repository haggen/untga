import { Metadata } from "next";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Heading } from "~/components/heading";
import { createStatefulAction } from "~/lib/actions";
import { db } from "~/lib/db";
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
    <div className="grow flex flex-col gap-12">
      <header>
        <Image
          src="/signpost.png"
          alt="Nondescript signpost."
          width={702}
          height={702}
          className="w-full mix-blend-color-burn"
        />

        <div className="flex flex-col gap-1.5">
          <Heading size="large" asChild>
            <h1>{location.name}</h1>
          </Heading>

          <p>{location.description}</p>
        </div>
      </header>

      <Form travel={travel} />
    </div>
  );
}
