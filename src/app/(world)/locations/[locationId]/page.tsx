"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Heading } from "~/components/simple/Heading";
import * as Menu from "~/components/simple/Menu";
import { client } from "~/lib/client";
import { parse, schemas } from "~/lib/validation";


export default function Page({ params }: { params: Promise<unknown> }) {
  const { locationId } = parse(use(params), {
    locationId: schemas.id,
  });

  const protagonistQuery = useQuery({
    queryKey: client.characters.protagonist.queryKey(),
    queryFn: () => client.characters.protagonist.get(),
    throwOnError: true,
  });

  const protagonist = protagonistQuery.data!.payload;

  const router = useRouter();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: client.locations.queryKey(locationId),
    queryFn: () => client.locations.get(locationId),
  });

  const travel = useMutation({
    mutationFn: () =>
      client.characters.location.put(protagonist.id, { locationId }),
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: client.characters.location.queryKey(protagonist.id),
      });
      await queryClient.invalidateQueries({
        queryKey: client.characters.logs.queryKey(protagonist.id),
      });
      dialog.close();
      router.push(`/characters/${protagonist.id}/location`);
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
    <div className="flex flex-col gap-1.5">
      <Image
        src="/signpost.png"
        alt="Non descript signpost."
        width={702}
        height={702}
        className="w-full mix-blend-color-burn"
      />
      <Heading as="h1">{location.name}</Heading>
      <p>{location.description}</p>
    </div>

    <Alert type="negative" dump={travel.error} />

    <Menu.Menu busy={travel.isPending}>
      <Menu.Item onClick={() => travel.mutate()}>Travel</Menu.Item>
      <Menu.Item onClick={() => dialog.close()}>Cancel</Menu.Item>
    </Menu.Menu>
  );
}
