import Link from "next/link";
import * as Definition from "~/components/Definition";
import { Heading } from "~/components/Heading";
import { ProtagonistHeader } from "~/components/ProtagonistHeader";
import { db } from "~/lib/db";
import { ensureActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";

export default async function Page({
  params,
}: Readonly<{ params: Promise<unknown> }>) {
  const { protagonistId } = parse(await params, {
    protagonistId: schemas.id,
  });

  const session = await ensureActiveSession(true);

  const protagonist = await db.character.findUniqueOrThrow({
    where: { id: protagonistId, user: { id: session.user.id } },
    include: {
      location: {
        include: {
          routes: { include: { destinations: true } },
          characters: true,
        },
      },
    },
  });

  const { location } = protagonist;
  const { routes, characters } = location;

  return (
    <div className="grow flex flex-col gap-12">
      <ProtagonistHeader character={protagonist} />

      <section className="flex flex-col gap-1.5">
        <Heading size="small" asChild>
          <h1>{location.name}</h1>
        </Heading>
        <p>{location.description || "No description available."}</p>
      </section>

      {routes.map((route) => (
        <section key={route.id} className="flex flex-col gap-1.5">
          <Heading size="small" asChild>
            <h1>{route.name}</h1>
          </Heading>

          <p>{route.description || "No description available."}</p>

          <Definition.List>
            {route.destinations.map((destination) => (
              <Link
                href={`/play/${protagonistId}/locations/${destination.id}`}
                key={destination.id}
              >
                <Definition.Item label={destination.name}>
                  <p>{destination.area}</p>
                </Definition.Item>
              </Link>
            ))}
          </Definition.List>
        </section>
      ))}

      <section className="flex flex-col gap-1.5">
        <Heading size="small" asChild>
          <h1>Characters</h1>
        </Heading>

        <Definition.List>
          {characters.map((character) => (
            <Definition.Item key={character.id} label={character.name}>
              <p>{character.status}</p>
            </Definition.Item>
          ))}
        </Definition.List>
      </section>
    </div>
  );
}
