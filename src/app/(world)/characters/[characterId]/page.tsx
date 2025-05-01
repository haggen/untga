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
    <Menu.Menu>
      <Menu.Item href={`/${characterId}/edit`}>Edit</Menu.Item>
      <Menu.Item href="/characters">Switch</Menu.Item>
      <Menu.Item onClick={() => router.back()}>Cancel</Menu.Item>
    </Menu.Menu>
  );
}

function CharacterMenu({}: { characterId: number }) {
  const router = useRouter();

  return (
    <Menu.Menu>
      <Menu.Item onClick={() => router.back()}>Cancel</Menu.Item>
    </Menu.Menu>
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
    <div className="flex flex-col gap-section">
      <div className="flex flex-col gap-text">
        <Image
          src="/silhouette.png"
          alt="Non descript person silhouette."
          width={702}
          height={702}
          className="w-full mix-blend-color-burn"
        />

        <Heading as="h1" className="truncate">
          {query.isLoading ? "Loading..." : character?.name}
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
