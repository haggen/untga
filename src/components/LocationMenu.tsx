"use client";

import { useQuery } from "@tanstack/react-query";
import { Heading } from "~/components/simple/Heading";
import * as Menu from "~/components/simple/Menu";
import { client } from "~/lib/client";

type Props = {
  characterId: number;
  locationId: number;
};

export function LocationMenu({ locationId }: Props) {
  const query = useQuery({
    queryKey: client.locations.queryKey(locationId),
    queryFn: () => client.locations.get(locationId),
  });

  if (query.isLoading) {
    return <p>Loading...</p>;
  }

  if (!query.data) {
    return <p>Location not found.</p>;
  }

  const location = query.data.payload;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Heading asChild>
          <h1>{location.name}</h1>
        </Heading>
        <p>{location.description}</p>
      </div>

      <Menu.Menu>
        <Menu.Item>Travel</Menu.Item>
        <Menu.Item>Cancel</Menu.Item>
      </Menu.Menu>
    </div>
  );
}
