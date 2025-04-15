"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { Alert } from "~/components/Alert";
import { Definition } from "~/components/Definition";
import { Heading } from "~/components/Heading";
import { client } from "~/lib/client";
import { parse, schemas } from "~/lib/validation";
import { Header } from "../header";

function Location({ locationId }: { locationId: number }) {
  const query = useQuery({
    queryKey: client.locations.queryKey(locationId),
    queryFn: () => client.locations.get(locationId),
  });

  const location = query.data?.payload;

  return (
    <section className="flex flex-col gap-1.5">
      <Heading variant="small" asChild>
        <h2>{location?.name ?? "Loading..."}</h2>
      </Heading>
      <p>
        {query.isLoading
          ? "Loading..."
          : location?.description ?? "No description available."}
      </p>
    </section>
  );
}

function Characters({ locationId }: { locationId: number }) {
  const query = useQuery({
    queryKey: client.locations.characters.queryKey(locationId),
    queryFn: () => client.locations.characters.get(locationId),
  });

  const characters = query.data?.payload ?? [];

  return (
    <section className="flex flex-col gap-1.5">
      <Heading variant="small" asChild>
        <h2>Characters</h2>
      </Heading>

      <Definition.List>
        {characters.map((character) => (
          <Definition key={character.id} label={character.name}>
            {character.status}
          </Definition>
        ))}
      </Definition.List>
    </section>
  );
}

function Exits({ locationId }: { locationId: number }) {
  const query = useQuery({
    queryKey: client.locations.exits.queryKey(locationId),
    queryFn: () => client.locations.exits.get(locationId),
  });

  const routes = query.data?.payload ?? [];

  return (
    <section className="flex flex-col gap-1.5">
      <Heading variant="small" asChild>
        <h2>Exits</h2>
      </Heading>

      <Definition.List>
        {routes.map((route) => (
          <Definition key={route.id} label={route.exit.name}>
            0 mi
          </Definition>
        ))}
      </Definition.List>
    </section>
  );
}

type Props = {
  params: Promise<{ characterId: string }>;
};

export default function Page({ params }: Props) {
  const { characterId } = parse(use(params), {
    characterId: schemas.id,
  });

  const query = useQuery({
    queryKey: client.characters.queryKey(characterId),
    queryFn: () => client.characters.get(characterId),
  });

  const { locationId } = query.data?.payload ?? {};

  if (!locationId) {
    return (
      <main className="flex flex-col gap-12">
        <Header characterId={characterId} />

        <Alert>Loading...</Alert>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-12">
      <Header characterId={characterId} />
      <Location locationId={locationId} />
      <Characters locationId={locationId} />
      <Exits locationId={locationId} />
    </main>
  );
}
