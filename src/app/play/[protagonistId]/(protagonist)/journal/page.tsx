"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { Alert } from "~/components/Alert";
import { Heading } from "~/components/Heading";
import { client } from "~/lib/client";
import { fmt } from "~/lib/fmt";
import { parse, schemas } from "~/lib/validation";

function Journal({ characterId }: { characterId: number }) {
  const query = useQuery({
    queryKey: client.characters.logs.queryKey(characterId),
    queryFn: () => client.characters.logs.get(characterId),
  });

  if (query.isLoading) {
    return (
      <Alert>
        <p>Loading...</p>
      </Alert>
    );
  }

  if (!query.data) {
    return null;
  }

  const logs = query.data.payload;

  return (
    <ul className="flex flex-col gap-1.5">
      {logs.map((log) => (
        <li key={log.id} className="flex gap-1.5 before:content-['⬥']">
          <article>
            <h1 className="text-sm text-stone-600">
              {fmt.datetime(log.createdAt, {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </h1>

            <p>{log.message}</p>
          </article>
        </li>
      ))}
    </ul>
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
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-3">
        <Heading size="small" asChild>
          <h2>Journal</h2>
        </Heading>

        <Journal characterId={characterId} />
      </section>
    </div>
  );
}
