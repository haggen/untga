"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { Alert } from "~/components/Alert";
import { Definition } from "~/components/Definition";
import { Heading } from "~/components/Heading";
import { client } from "~/lib/client";
import { parse, schemas } from "~/lib/validation";
import { Header } from "../header";

function Summary({ characterId }: { characterId: number }) {
  const characterQuery = useQuery({
    queryKey: client.characters.queryKey(characterId),
    queryFn: () => client.characters.get(characterId),
  });

  const resourcesQuery = useQuery({
    queryKey: client.characters.resources.queryKey(characterId),
    queryFn: () => client.characters.resources.get(characterId),
  });

  const character = characterQuery.data?.payload;
  const resources = resourcesQuery.data?.payload ?? [];

  return (
    <section className="flex flex-col gap-1.5">
      <Heading variant="small" asChild>
        <h2>Summary</h2>
      </Heading>

      {character ? (
        <Definition.List>
          <Definition label="Name">{character.name}</Definition>
          <Definition label="Birth">
            {new Date(character.createdAt).toLocaleDateString()}
          </Definition>
          <Definition label="Location">...</Definition>
          <Definition label="Status">{character.status}</Definition>
          {resources.map((resource) => (
            <Definition label={resource.spec.name} key={resource.id}>
              {resource.level}/{resource.cap}
            </Definition>
          ))}
        </Definition.List>
      ) : (
        <Alert>
          <p>Loading...</p>
        </Alert>
      )}
    </section>
  );
}

function Skills({ characterId }: { characterId: number }) {
  const { data } = useQuery({
    queryKey: client.characters.skills.queryKey(characterId),
    queryFn: () => client.characters.skills.get(characterId),
  });

  const skills = data?.payload ?? [];

  return (
    <section className="flex flex-col gap-1.5">
      <Heading variant="small" asChild>
        <h2>Skills</h2>
      </Heading>

      {skills.length > 0 ? (
        <Definition.List>
          {skills.map((skill) => (
            <Definition label={skill.spec.name} key={skill.id}>
              {Math.floor(skill.level * 100)}
            </Definition>
          ))}
        </Definition.List>
      ) : (
        <Alert>
          <p>Loading...</p>
        </Alert>
      )}
    </section>
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
    <main className="flex flex-col gap-12">
      <Header characterId={characterId} />
      <Summary characterId={characterId} />
      <Skills characterId={characterId} />
    </main>
  );
}
