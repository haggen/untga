"use client";

import { Alert } from "@/components/Alert";
import { Definition } from "@/components/Definition";
import { Heading } from "@/components/Heading";
import { useSession } from "@/components/SessionProvider";
import { Stack } from "@/components/Stack";
import {
  Character,
  client,
  Slot,
  WithAttributes,
  WithItem,
  WithLocation,
  WithResources,
} from "@/lib/client";
import { parse, schemas } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

function Summary({
  character,
}: {
  character: Character<WithLocation & WithResources>;
}) {
  return (
    <Stack gap={4} asChild>
      <section>
        <Heading variant="small" asChild>
          <h2>Summary</h2>
        </Heading>

        <Definition.List>
          <Definition label="Name">{character.name}</Definition>
          <Definition label="Birth">
            {new Date(character.createdAt).toLocaleDateString()}
          </Definition>
          <Definition label="Location">{character.location.name}</Definition>
          <Definition label="Status">{character.status}</Definition>
          {character.resources.map((resource) => (
            <Definition label={resource.spec.name} key={resource.id}>
              {resource.level}/{resource.cap}
            </Definition>
          ))}
        </Definition.List>
      </section>
    </Stack>
  );
}

function Attributes({ character }: { character: Character<WithAttributes> }) {
  return (
    <Stack gap={4} asChild>
      <section>
        <Heading variant="small" asChild>
          <h2>Attributes</h2>
        </Heading>

        <Definition.List>
          {character.attributes.map((attribute) => (
            <Definition label={attribute.spec.name} key={attribute.id}>
              {Math.floor(attribute.level * 100)}
            </Definition>
          ))}
        </Definition.List>
      </section>
    </Stack>
  );
}

function Equipment({ slots }: { slots: Slot<WithItem>[] }) {
  return (
    <Stack gap={4} asChild>
      <section>
        <Heading variant="small" asChild>
          <h2>Equipment</h2>
        </Heading>

        {slots.length ? (
          <Definition.List>
            {slots.map((slot) => (
              <Definition key={slot.id} label={slot.type}>
                {slot.item ? slot.item.spec.name : "Empty"}
              </Definition>
            ))}
          </Definition.List>
        ) : (
          <Alert type="neutral">Empty.</Alert>
        )}
      </section>
    </Stack>
  );
}

function Storage({
  userId,
  characterId,
}: {
  userId: number;
  characterId: number;
}) {
  const { data } = useQuery({
    queryKey: client.users.characters.storage.queryKey(userId, characterId),
    queryFn: () => client.users.characters.storage.get(userId, characterId),
  });

  if (!data) {
    return (
      <Alert type="neutral">
        <p>Loading...</p>
      </Alert>
    );
  }

  const container = data.payload.data;

  return (
    <Stack gap={4} asChild>
      <section>
        <Heading variant="small" asChild>
          <h2>{container.source.spec.name}</h2>
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
    </Stack>
  );
}

type Props = {
  params: Promise<{ characterId: string }>;
};

export default function Page({ params }: Props) {
  const { userId } = useSession();

  const { characterId } = parse(use(params), {
    characterId: schemas.id,
  });

  const { data } = useQuery({
    queryKey: client.users.characters.queryKey(userId, characterId),
    queryFn: () => client.users.characters.get(userId, characterId),
  });

  if (!data) {
    return (
      <Alert type="neutral">
        <p>Loading...</p>
      </Alert>
    );
  }

  const character = data.payload.data;

  return (
    <Stack gap={10} asChild>
      <main>
        <Stack gap={4} asChild>
          <header>
            <Heading asChild>
              <h1>{character.name}</h1>
            </Heading>

            <p>{character.description ?? "No description given."}</p>
          </header>
        </Stack>

        <Summary character={character} />

        <Attributes character={character} />

        <Equipment slots={character.slots} />

        <Storage userId={userId} characterId={characterId} />
      </main>
    </Stack>
  );
}
