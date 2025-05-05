import { EllipsisIcon } from "lucide-react";
import Link from "next/link";
import { Heading } from "~/components/heading";
import { Character } from "~/lib/db";

export function Header({ character }: Readonly<{ character: Character }>) {
  return (
    <header className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Heading size="large" asChild className="truncate">
          <h1>{character.name}</h1>
        </Heading>

        <Link href={`/play/${character.id}/characters/${character.id}`}>
          <EllipsisIcon />
        </Link>
      </div>

      <p>{character.description || "No description available."}</p>
    </header>
  );
}
