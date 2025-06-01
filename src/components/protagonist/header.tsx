import { EllipsisIcon } from "lucide-react";
import { Button } from "~/components/button";
import { Heading } from "~/components/heading";
import { Link } from "~/components/link";
import { Character, WithAttributes, WithLocation } from "~/db";
import { ensure } from "~/lib/ensure";
import { fmt } from "~/lib/fmt";
import { tag } from "~/lib/tags";

export function Header({
  character,
}: Readonly<{ character: Character<WithAttributes & WithLocation> }>) {
  const health = ensure(
    character.attributes.find(({ spec }) => spec.tags.includes(tag.Health)),
    "Can't find health attribute."
  );

  const stamina = ensure(
    character.attributes.find(({ spec }) => spec.tags.includes(tag.Stamina)),
    "Can't find stamina attribute."
  );

  return (
    <header className="flex flex-col gap-text p-section bg-[url(/marble.jpg)] sticky top-10">
      <div className="flex items-center gap-6">
        <Heading size="large" asChild className="truncate">
          <h1>{character.name}</h1>
        </Heading>

        <Button variant="alternate" size="small" asChild>
          <Link
            href={`/protagonist/${character.id}/characters/${character.id}`}
            aria-label="Character menu"
          >
            <EllipsisIcon />
          </Link>
        </Button>
      </div>

      <p>
        {fmt.character.health(health.level)}.{" "}
        {fmt.character.stamina(stamina.level)}.{" "}
        {fmt.character.status(character.status)} at {character.location.name}.
      </p>
    </header>
  );
}
