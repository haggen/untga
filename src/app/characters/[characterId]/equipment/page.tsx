"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { Alert } from "~/components/Alert";
import { Definition } from "~/components/Definition";
import { Heading } from "~/components/Heading";
import { client } from "~/lib/client";
import { parse, schemas } from "~/lib/validation";
import * as tags from "~/static/tags";
import { Header } from "../header";

function Equipment({ characterId }: { characterId: number }) {
  const { data: { payload: slots } = {} } = useQuery({
    queryKey: client.characters.slots.queryKey(characterId),
    queryFn: () => client.characters.slots.get(characterId),
  });

  return (
    <section className="flex flex-col gap-1.5">
      <Heading variant="small" asChild>
        <h2>Equipment</h2>
      </Heading>

      <Definition.List>
        {slots ? (
          slots.map((slot) => (
            <Definition key={slot.id} label={slot.tags.join()}>
              {slot.items[0]?.spec.name ?? "Empty"}
            </Definition>
          ))
        ) : (
          <Definition label="Loading...">Loading...</Definition>
        )}
      </Definition.List>
    </section>
  );
}

function Storage({ characterId }: { characterId: number }) {
  const { data: { payload: slots } = {} } = useQuery({
    queryKey: [...client.characters.slots.queryKey(characterId)],
    queryFn: () => client.characters.slots.get(characterId),
  });

  const slot = slots?.find((slot) => slot.tags.includes(tags.Back));
  const backpack = slot?.items[0];
  const backpackId = backpack?.id ?? 0;

  const { data: { payload: storage } = {}, isLoading } = useQuery({
    queryKey: client.items.storage.queryKey(backpackId),
    queryFn: () => client.items.storage.get(backpackId),
    enabled: !!backpack,
  });

  return (
    <section className="flex flex-col gap-1.5">
      <Heading variant="small" asChild>
        <h2>{backpack?.spec.name}</h2>
      </Heading>

      {isLoading ? (
        <Alert type="neutral">Loading...</Alert>
      ) : storage?.items.length ? (
        <Definition.List>
          {storage.items.map((item) => (
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

      <Equipment characterId={characterId} />

      <Storage characterId={characterId} />
    </main>
  );
}
