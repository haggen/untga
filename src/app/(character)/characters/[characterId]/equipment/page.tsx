"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { Alert } from "~/components/Alert";
import { Definition } from "~/components/Definition";
import { Heading } from "~/components/Heading";
import { client, Container, WithItems, WithSource } from "~/lib/client";
import { parse, schemas } from "~/lib/validation";
import { Header } from "../header";

function Slots({ characterId }: { characterId: number }) {
  const query = useQuery({
    queryKey: client.characters.slots.queryKey(characterId),
    queryFn: () => client.characters.slots.get(characterId),
  });

  if (query.isLoading) {
    return (
      <Definition.List>
        {Array(7)
          .fill(undefined)
          .map((_, index) => (
            <Definition key={index} label="Loading...">
              Loading...
            </Definition>
          ))}
      </Definition.List>
    );
  }

  if (!query.data) {
    return null;
  }

  const slots = query.data.payload;

  return (
    <Definition.List>
      {slots.map((slot) => (
        <Definition key={slot.id} label={slot.slot}>
          {slot.items[0]?.spec.name ?? "Empty"}
        </Definition>
      ))}
    </Definition.List>
  );
}

function Contents({
  container,
}: {
  container: Container<WithSource & WithItems>;
}) {
  return (
    <section key={container.id} className="flex flex-col gap-1.5">
      <Heading variant="small" asChild>
        <h2>{container.items[0].spec.name}</h2>
      </Heading>

      {container.items.length ? (
        <Definition.List>
          {container.items.map((item) => (
            <Definition key={item.id} label={item.spec.name}>
              &times;{item.amount}
            </Definition>
          ))}
        </Definition.List>
      ) : (
        <Alert type="neutral">Empty.</Alert>
      )}
    </section>
  );
}

function Storage({ characterId }: { characterId: number }) {
  const query = useQuery({
    queryKey: client.characters.storage.queryKey(characterId),
    queryFn: () => client.characters.storage.get(characterId),
  });

  if (query.isLoading) {
    return <Alert type="neutral">Loading...</Alert>;
  }

  if (!query.data) {
    return null;
  }

  const storage = query.data.payload;

  return storage.map((container) => (
    <Contents key={container.id} container={container} />
  ));
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

      <section className="flex flex-col gap-1.5">
        <Heading variant="small" asChild>
          <h2>Equipment</h2>
        </Heading>

        <Slots characterId={characterId} />
      </section>

      <Storage characterId={characterId} />
    </main>
  );
}
