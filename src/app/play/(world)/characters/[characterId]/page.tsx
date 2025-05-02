"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Heading } from "~/components/simple/Heading";
import * as Menu from "~/components/simple/Menu";
import { client } from "~/lib/client";
import { parse, schemas } from "~/lib/validation";

function ProtagonistMenu({ characterId }: { characterId: number }) {
  const router = useRouter();

  return (
    <Menu.List>
      <Menu.Item href={`/${characterId}/edit`}>Edit</Menu.Item>
      <Menu.Item href="/characters">Switch</Menu.Item>
      <Menu.Item onClick={() => router.back()}>Cancel</Menu.Item>
    </Menu.List>
  );
}

function CharacterMenu({}: { characterId: number }) {
  const router = useRouter();

  return (
    <Menu.List>
      <Menu.Item onClick={() => router.back()}>Cancel</Menu.Item>
    </Menu.List>
  );
}

export default function Page({ params }: { params: Promise<unknown> }) {
  const { characterId, protagonistId } = parse(use(params), {
    protagonistId: schemas.id,
    characterId: schemas.id,
  });

  const query = useQuery({
    queryKey: client.characters.queryKey(characterId),
    queryFn: () => client.characters.get(characterId),
  });

  const character = query.data?.payload;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-1.5">
        <Image
          src="/silhouette.png"
          alt="Nondescript silhouette of a person."
          width={702}
          height={702}
          className="w-full mix-blend-color-burn"
        />

        <Heading size="large" asChild className="truncate">
          <h1>{query.isLoading ? "Loading..." : character?.name}</h1>
        </Heading>

        <p>
          {query.isLoading
            ? "Loading..."
            : character?.description || "No description available."}
        </p>
      </div>

      {protagonistId === characterId ? (
        <ProtagonistMenu characterId={protagonistId} />
      ) : (
        <CharacterMenu characterId={characterId} />
      )}
    </div>
  );
}
