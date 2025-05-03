import { revalidatePath } from "next/cache";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Heading } from "~/components/Heading";
import * as Menu from "~/components/Menu";
import { db } from "~/lib/db";
import { ensureActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";

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

  const travel = async ({
    characterId,
    locationId,
  }: {
    characterId: number;
    locationId: number;
  }) => {
    "use server";

    const session = await ensureActiveSession();

    await db.character.update({
      where: { id: characterId, user: { id: session.user.id } },
      data: {
        location: {
          connect: { id: locationId },
        },
      },
    });

    revalidatePath(`/play/${characterId}/location`);
    redirect(`/play/${characterId}/location`);
  };

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

      <form>
        <Menu.List>
          <Menu.Item
            action={travel.bind(null, {
              characterId: protagonistId,
              locationId,
            })}
          >
            Travel
          </Menu.Item>
        </Menu.List>
      </form>
    </div>
  );
}
