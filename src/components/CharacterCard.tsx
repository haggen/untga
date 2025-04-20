import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "~/components/simple/Button";
import { Heading } from "~/components/simple/Heading";
import { client } from "~/lib/client";

export function Header({ characterId }: { characterId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: client.characters.queryKey(characterId),
    queryFn: () => client.characters.get(characterId),
  });

  const character = data?.payload;

  return (
    <header className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Heading asChild className="truncate">
          <h1>{isLoading ? "Loading..." : character?.name}</h1>
        </Heading>

        <menu className="flex items-center">
          <li>
            <Button asChild variant="nested" size="small">
              <Link href={`/characters/${characterId}/edit`}>Edit</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="nested" size="small">
              <Link href="/characters">Switch</Link>
            </Button>
          </li>
        </menu>
      </div>

      <p>
        {isLoading
          ? "Loading..."
          : character?.description || "No description available."}
      </p>
    </header>
  );
}
