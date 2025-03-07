"use client";

import { Alert } from "@/components/Alert";
import { Heading } from "@/components/Heading";
import { useSession } from "@/components/SessionProvider";
import { Stack } from "@/components/Stack";
import { client } from "@/lib/client";
import type { Character, Container } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

type WithLocation = {
  include: {
    location: true;
  };
};

type WithAttributes = {
  include: { attributes: { include: { specification: true } } };
};

type WithContainer = {
  include: { container: WithItems };
};

type WithItems = {
  include: { items: { include: { specification: true } } };
};

function Sheet({
  character,
}: {
  character: Character<WithLocation & WithAttributes>;
}) {
  return (
    <Stack gap={4} asChild>
      <section>
        <Heading variant="small" asChild>
          <h2>Sheet</h2>
        </Heading>

        <dl>
          <div className="flex items-center gap-1">
            <dt className="flex items-center gap-1 grow after:content after:grow after:border-t-2 after:border-dotted after:border-current/35">
              Name
            </dt>
            <dd>{character.name}</dd>
          </div>
          <div className="flex items-center gap-1">
            <dt className="flex items-center gap-1 grow after:content after:grow after:border-t-2 after:border-dotted after:border-current/35">
              Birth
            </dt>
            <dd>{new Date(character.createdAt).toLocaleDateString()}</dd>
          </div>
          <div className="flex items-center gap-1">
            <dt className="flex items-center gap-1 grow after:content after:grow after:border-t-2 after:border-dotted after:border-current/35">
              Location
            </dt>
            <dd>{character.location.name}</dd>
          </div>
          {character.attributes.map((attribute) => (
            <div className="flex items-center gap-1" key={attribute.id}>
              <dt className="flex items-center gap-1 grow after:content after:grow after:border-t-2 after:border-dotted after:border-current/35">
                {attribute.specification.name}
              </dt>
              <dd>
                {attribute.level} ({attribute.progress}%)
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </Stack>
  );
}

function Inventory({ container }: { container: Container<WithItems> }) {
  console.log(container.items);

  return (
    <Stack gap={4} asChild>
      <section>
        <Heading variant="small" asChild>
          <h2>Inventory</h2>
        </Heading>

        {container.items.length ? (
          <dl>
            {container.items.map((item) => (
              <div className="flex items-center gap-1" key={item.id}>
                <dt className="flex items-center gap-1 grow after:content after:grow after:border-t-2 after:border-dotted after:border-current/35">
                  {item.specification.name}
                </dt>
                <dd>&times;{item.amount}</dd>
              </div>
            ))}
          </dl>
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
  useSession();
  const { characterId } = use(params);

  const { data } = useQuery({
    queryKey: ["characters", characterId],
    queryFn: () =>
      client.request<{
        data: Character<WithLocation & WithAttributes & WithContainer>;
      }>(`/api/characters/${characterId}`),
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

        <Sheet character={character} />

        <Inventory container={character.container} />
      </main>
    </Stack>
  );
}
