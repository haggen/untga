import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function Header({ characterId }: { characterId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: client.characters.queryKey(characterId),
    queryFn: () => client.characters.get(characterId),
  });

  const character = data?.payload;

  return (
    <header className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Heading asChild>
          <h1>{isLoading ? "Loading..." : character?.name}</h1>
        </Heading>

        <menu className="flex gap-1.5">
          <li>
            <Button asChild variant="secondary" size="small">
              <Link href={`/characters/${characterId}/edit`}>Edit</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="secondary" size="small">
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
