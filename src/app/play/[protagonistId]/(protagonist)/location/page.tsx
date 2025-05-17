import { Metadata } from "next";
import Link from "next/link";
import { Badge } from "~/components/badge";
import * as Definition from "~/components/definition";
import { Heading } from "~/components/heading";
import { Header } from "~/components/protagonist/header";
import { db } from "~/lib/db";
import { fmt } from "~/lib/fmt";
import { ensureActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";

export const metadata: Metadata = {
  title: "Character's location",
};

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
          routes: {
            include: {
              destinations: true,
              _count: { select: { characters: true } },
            },
          },
          characters: true,
          _count: { select: { characters: true } },
        },
      },
      attributes: { include: { spec: true } },
    },
  });

  const { location } = protagonist;
  const { routes, characters } = location;

  return (
    <div className="flex flex-col grow">
      <Header character={protagonist} />

      <section className="flex flex-col gap-2 p-section">
        <hgroup className="flex flex-col items-start gap-2">
          <Badge asChild>
            <h1>Current location</h1>
          </Badge>

          <Heading size="small" asChild>
            <p>{location.name}</p>
          </Heading>
        </hgroup>

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
      </section>

      {routes.map((route) => (
        <section key={route.id} className="flex flex-col gap-2 p-section">
          <hgroup className="flex flex-col items-start gap-2">
            <Badge asChild>
              <h1>Exit route</h1>
            </Badge>

            <Heading size="small" asChild>
              <p>{route.name}</p>
            </Heading>
          </hgroup>

          <p>{route.description || "No description available."}</p>

          <Definition.List>
            <Definition.Item label="Security">
              {fmt.location.security(route.security)}
            </Definition.Item>
            <Definition.Item label="Area">
              {fmt.number(route.area, {
                unit: "mile",
                style: "unit",
              })}
            </Definition.Item>
            <Definition.Item label="Population">
              {fmt.plural(route._count.characters, {
                one: "# person",
                other: "# people",
                zero: "Empty",
              })}
            </Definition.Item>
          </Definition.List>

          <Definition.List>
            {route.destinations
              .filter(({ id }) => id !== location.id)
              .map((destination) => (
                <Link
                  href={`/play/${protagonistId}/locations/${destination.id}`}
                  key={destination.id}
                >
                  <Definition.Item label={destination.name}>
                    <p>
                      {fmt.number(destination.area, {
                        unit: "mile",
                        style: "unit",
                      })}
                    </p>
                  </Definition.Item>
                </Link>
              ))}
          </Definition.List>
        </section>
      ))}

      <section className="flex flex-col gap-2 p-section">
        <Heading size="small" asChild>
          <h1>Characters</h1>
        </Heading>

        <Definition.List>
          {characters.map((character) => (
            <Definition.Item key={character.id} label={character.name}>
              <p>{fmt.string(character.status, { title: true })}</p>
            </Definition.Item>
          ))}
        </Definition.List>
      </section>
    </div>
  );
}
