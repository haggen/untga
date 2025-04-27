import { useQuery } from "@tanstack/react-query";
import { EllipsisIcon } from "lucide-react";
import { Dialog, useDialog } from "~/components/simple/Dialog";
import { Heading } from "~/components/simple/Heading";
import * as Menu from "~/components/simple/Menu";
import { client } from "~/lib/client";

export function Header({ characterId }: { characterId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: client.characters.queryKey(characterId),
    queryFn: () => client.characters.get(characterId),
  });

  const dialog = useDialog();

  const character = data?.payload;

  return (
    <header className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Heading as="h1" className="truncate">
          {isLoading ? "Loading..." : character?.name}
        </Heading>

        <button onClick={() => dialog.toggle()}>
          <EllipsisIcon />
        </button>
      </div>

      <p>
        {isLoading
          ? "Loading..."
          : character?.description || "No description available."}
      </p>

      <Dialog ref={dialog.ref}>
        <div className="flex flex-col gap-1.5">
          <Heading as="h1" className="truncate">
            {isLoading ? "Loading..." : character?.name}
          </Heading>

          <p>
            {isLoading
              ? "Loading..."
              : character?.description || "No description available."}
          </p>
        </div>

        <Menu.Menu>
          <Menu.Item href={`/characters/${characterId}/edit`}>Edit</Menu.Item>
          <Menu.Item href="/characters">Switch</Menu.Item>
          <Menu.Item onClick={() => dialog.close()}>Cancel</Menu.Item>
        </Menu.Menu>
      </Dialog>
    </header>
  );
}
