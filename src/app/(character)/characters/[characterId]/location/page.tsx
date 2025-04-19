"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { Definition } from "~/components/Definition";
import { Heading } from "~/components/Heading";
import { client } from "~/lib/client";
import { fmt } from "~/lib/fmt";
import { parse, schemas } from "~/lib/validation";
import { Header } from "../header";

function Summary({ characterId }: { characterId: number }) {
  const query = useQuery({
    queryKey: client.characters.location.queryKey(characterId),
    queryFn: () => client.characters.location.get(characterId),
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

function Exits({ characterId }: { characterId: number }) {
  const query = useQuery({
    queryKey: client.characters.location.queryKey(characterId),
    queryFn: () => client.characters.location.get(characterId),
  });

  if (query.isLoading) {
    return (
      <Definition.List>
        <Definition label="Loading...">Loading...</Definition>
      </Definition.List>
    );
  }

  if (!query.data) {
    return null;
  }

  const { exits } = query.data.payload;

  return (
    <Definition.List>
      {exits.map((route) => (
        <Definition key={route.id} label={route.exit.name}>
          {fmt.plural(route.length, { one: "# mile" })}
        </Definition>
      ))}
    </Definition.List>
  );
}

function Characters({ characterId }: { characterId: number }) {
  const query = useQuery({
    queryKey: client.characters.location.queryKey(characterId),
    queryFn: () => client.characters.location.get(characterId),
  });

  if (query.isLoading) {
    return (
      <Definition.List>
        <Definition label="Loading...">Loading...</Definition>
      </Definition.List>
    );
  }

  if (!query.data) {
    return null;
  }

  const { characters } = query.data.payload;

  return (
    <Definition.List>
      {characters.map((character) => (
        <Definition key={character.id} label={character.name}>
          {character.status}
        </Definition>
      ))}
    </Definition.List>
  );
}

type Props = {
  params: Promise<{ characterId: string }>;
};

export default function Page({ params }: Props) {
  const { characterId } = parse(use(params), {
    characterId: schemas.id,
  });

  return (
    <main className="flex flex-col gap-12">
      <Header characterId={characterId} />

      <Summary characterId={characterId} />

      <section className="flex flex-col gap-1.5">
        <Heading variant="small" asChild>
          <h2>Exits</h2>
        </Heading>

        <Exits characterId={characterId} />
      </section>

      <section className="flex flex-col gap-1.5">
        <Heading variant="small" asChild>
          <h2>Characters</h2>
        </Heading>

        <Characters characterId={characterId} />
      </section>
    </main>
  );
}
