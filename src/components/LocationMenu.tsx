"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Ref } from "react";
import { Alert } from "~/components/simple/Alert";
import { Dialog, useDialog } from "~/components/simple/Dialog";
import { Heading } from "~/components/simple/Heading";
import * as Menu from "~/components/simple/Menu";
import { client } from "~/lib/client";

export function LocationMenu({
  ref,
  locationId,
  characterId,
}: {
  ref: Ref<HTMLDialogElement>;
  characterId: number;
  locationId: number;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: client.locations.queryKey(locationId),
    queryFn: () => client.locations.get(locationId),
  });

  const dialog = useDialog(ref);

  const travel = useMutation({
    mutationFn: () =>
      client.characters.location.put(characterId, { locationId }),
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: client.characters.location.queryKey(characterId),
      });
      await queryClient.invalidateQueries({
        queryKey: client.characters.logs.queryKey(characterId),
      });
      dialog.close();
      router.push(`/characters/${characterId}/location`);
    },
    onError(error) {
      console.error("Error traveling to location:", error);
    },
  });

  if (!query.data) {
    return null;
  }

  const location = query.data.payload;

  return (
    <Dialog ref={dialog.ref}>
      <div className="flex flex-col gap-1.5">
        <Heading as="h1">{location.name}</Heading>
        <p>{location.description}</p>
      </div>

      <Alert type="negative" dump={travel.error} />

      <Menu.Menu busy={travel.isPending}>
        <Menu.Item onClick={() => travel.mutate()}>Travel</Menu.Item>
        <Menu.Item onClick={() => dialog.close()}>Cancel</Menu.Item>
      </Menu.Menu>
    </Dialog>
  );
}
