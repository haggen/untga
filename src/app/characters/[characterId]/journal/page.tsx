"use client";

import { Alert } from "@/components/Alert";
import { Heading } from "@/components/Heading";
import { client } from "@/lib/client";
import { parse, schemas } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { Header } from "../header";

function Journal({ characterId }: { characterId: number }) {
  const query = useQuery({
    queryKey: client.characters.logs.queryKey(characterId),
    queryFn: () => client.characters.logs.get(characterId),
  });

  const logs = query.data?.payload.data ?? [];

  return (
    <section className="flex flex-col gap-1.5">
      <Heading variant="small" asChild>
        <h2>Journal</h2>
      </Heading>

      {logs.length > 0 ? (
        <ul>
          {logs.map((log) => (
            <li key={log.id}>{log.message}</li>
          ))}
        </ul>
      ) : (
        <Alert>
          <p>Loading...</p>
        </Alert>
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
      <Journal characterId={characterId} />
    </main>
  );
}
