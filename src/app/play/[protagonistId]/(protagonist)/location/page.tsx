"use client";

import { useQuery } from "@tanstack/react-query";
import { Fragment, use } from "react";
import { Alert } from "~/components/simple/Alert";
import * as Definition from "~/components/simple/Definition";
import { useDialog } from "~/components/simple/Dialog";
import { Heading } from "~/components/simple/Heading";
import { client } from "~/lib/client";
import { fmt } from "~/lib/fmt";
import { parse, schemas } from "~/lib/validation";

function Summary({ characterId }: { characterId: number }) {
  const query = useQuery({
    queryKey: client.characters.location.queryKey(characterId),
    queryFn: () => client.characters.location.get(characterId),
  });

  const location = query.data?.payload;

  return (
    <section className="flex flex-col gap-1.5">
      <Heading size="small" asChild>
        <h2>{location?.name ?? "Loading..."}</h2>
      </Heading>
      <p>
        {query.isLoading
          ? "Loading..."
          : location?.description ?? "No description available."}
      </p>
    </section>
  );
}

function Destination({ locationId }: { locationId: number }) {
  const dialog = useDialog();

  const query = useQuery({
    queryKey: client.locations.queryKey(locationId),
    queryFn: () => client.locations.get(locationId),
  });

  if (query.isLoading) {
    return <Definition.Item label="Loading...">Loading...</Definition.Item>;
  }

  if (!query.data) {
    return null;
  }

  const location = query.data.payload;

  return (
    <Fragment>
      <Definition.Item
        key={location.id}
        label={location.name}
        onClick={() => dialog.open()}
      >
        {fmt.plural(location.area, { one: "# mile" })}
      </Definition.Item>
    </Fragment>
  );
}

function Destinations({ routeId }: { routeId: number }) {
  const query = useQuery({
    queryKey: client.locations.queryKey(routeId),
    queryFn: () => client.locations.get(routeId),
  });

  if (query.isLoading) {
    return (
      <Definition.List>
        <Definition.Item label="Loading...">Loading...</Definition.Item>
      </Definition.List>
    );
  }

  if (!query.data) {
    return null;
  }

  const { destinations } = query.data.payload;

  return (
    <Definition.List>
      {destinations.map((destination) => (
        <Destination key={destination.id} locationId={destination.id} />
      ))}
    </Definition.List>
  );
}

function Route({ locationId }: { locationId: number }) {
  const query = useQuery({
    queryKey: client.locations.queryKey(locationId),
    queryFn: () => client.locations.get(locationId),
  });

  const route = query.data?.payload;

  return (
    <section className="flex flex-col gap-1.5">
      <Heading asChild size="small">
        <h2>{route?.name ?? "Loading..."}</h2>
      </Heading>

      <p>
        {query.isLoading
          ? "Loading..."
          : route?.description ?? "No description given."}
      </p>

      <Destinations routeId={locationId} />
    </section>
  );
}

function Routes({ characterId }: { characterId: number }) {
  const query = useQuery({
    queryKey: client.characters.location.queryKey(characterId),
    queryFn: () => client.characters.location.get(characterId),
  });

  if (query.isLoading) {
    return (
      <Alert>
        <p>Loading...</p>
      </Alert>
    );
  }

  if (!query.data) {
    return null;
  }

  const { routes } = query.data.payload;

  return routes.map((route) => <Route key={route.id} locationId={route.id} />);
}

function Characters({ characterId }: { characterId: number }) {
  const query = useQuery({
    queryKey: client.characters.location.queryKey(characterId),
    queryFn: () => client.characters.location.get(characterId),
  });

  if (query.isLoading) {
    return (
      <Definition.List>
        <Definition.Item label="Loading...">Loading...</Definition.Item>
      </Definition.List>
    );
  }

  if (!query.data) {
    return null;
  }

  const { characters } = query.data.payload;

  return (
    <Definition.List>
      {characters.map((character) => (
        <Definition.Item key={character.id} label={character.name}>
          {character.status}
        </Definition.Item>
      ))}
    </Definition.List>
  );
}

type Props = {
  params: Promise<{ characterId: string }>;
};

export default function Page({ params }: Props) {
  const { characterId } = parse(use(params), {
    characterId: schemas.id,
  });

  return (
    <div className="flex flex-col gap-12">
      <Summary characterId={characterId} />

      <Routes characterId={characterId} />

      <section className="flex flex-col gap-1.5">
        <Heading size="small" asChild>
          <h2>Characters</h2>
        </Heading>

        <Characters characterId={characterId} />
      </section>
    </div>
  );
}
