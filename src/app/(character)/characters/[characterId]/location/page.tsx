"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { Header } from "~/components/CharacterCard";
import * as Definition from "~/components/simple/Definition";
import { Heading } from "~/components/simple/Heading";
import { client } from "~/lib/client";
import { fmt } from "~/lib/fmt";
import { parse, schemas } from "~/lib/validation";

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
        <Definition.Item label="Loading...">Loading...</Definition.Item>
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
        <Definition.Item key={route.id} label={route.exit.name}>
          {fmt.plural(route.length, { one: "# mile" })}
        </Definition.Item>
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
        <Definition.Item label="Loading...">Loading...</Definition.Item>
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
        <Definition.Item key={character.id} label={character.name}>
          {character.status}
        </Definition.Item>
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
