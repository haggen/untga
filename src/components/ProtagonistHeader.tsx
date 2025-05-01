import { useQuery } from "@tanstack/react-query";
import { EllipsisIcon } from "lucide-react";
import Link from "next/link";
import { Heading } from "~/components/simple/Heading";
import { client } from "~/lib/client";

export function ProtagonistHeader({ characterId }: { characterId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: client.characters.queryKey(characterId),
    queryFn: () => client.characters.get(characterId),
  });

  const character = data?.payload;

  return (
    <header className="flex flex-col gap-text">
      <div className="flex items-center justify-between">
        <Heading as="h1" className="truncate">
          {isLoading ? "Loading..." : character?.name}
        </Heading>

        <Link href={`/characters/${characterId}`}>
          <EllipsisIcon />
        </Link>
      </div>

      <p>
        {isLoading
          ? "Loading..."
          : character?.description || "No description available."}
      </p>
    </header>
  );
}
