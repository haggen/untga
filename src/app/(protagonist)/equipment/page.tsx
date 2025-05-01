"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { ProtagonistHeader } from "~/components/ProtagonistHeader";
import { Alert } from "~/components/simple/Alert";
import * as Definition from "~/components/simple/Definition";
import { Heading } from "~/components/simple/Heading";
import { client, Container, WithItems, WithSource } from "~/lib/client";
import { parse, schemas } from "~/lib/validation";

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
            <Definition.Item key={index} label="Loading...">
              Loading...
            </Definition.Item>
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
        <Definition.Item key={slot.id} label={slot.slot}>
          {slot.items[0]?.spec.name ?? "Empty"}
        </Definition.Item>
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
        <h2>{container.source?.spec.name}</h2>
      </Heading>

      {container.items.length ? (
        <Definition.List>
          {container.items.map((item) => (
            <Definition.Item key={item.id} label={item.spec.name}>
              &times;{item.amount}
            </Definition.Item>
          ))}
        </Definition.List>
      ) : (
        <Alert>Empty.</Alert>
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
      <ProtagonistHeader characterId={characterId} />

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
