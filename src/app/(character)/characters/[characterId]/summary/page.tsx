"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { use } from "react";
import { Header } from "~/components/CharacterCard";
import * as Definition from "~/components/simple/Definition";
import { Heading } from "~/components/simple/Heading";
import { client } from "~/lib/client";
import { fmt } from "~/lib/fmt";
import { parse, schemas } from "~/lib/validation";

function CharacterStats({ characterId }: { characterId: number }) {
  const query = useQuery({
    queryKey: client.characters.queryKey(characterId),
    queryFn: () => client.characters.get(characterId),
  });

  if (query.isLoading) {
    return [
      <Definition.Item key={0} label="Name">
        Loading...
      </Definition.Item>,
      <Definition.Item key={1} label="Birth">
        Loading...
      </Definition.Item>,
      <Definition.Item key={2} label="Location">
        Loading...
      </Definition.Item>,
      <Definition.Item key={3} label="Status">
        Loading...
      </Definition.Item>,
    ];
  }

  if (!query.data) {
    return null;
  }

  const character = query.data.payload;

  return [
    <Definition.Item key={0} label="Name">
      {character.name}
    </Definition.Item>,
    <Definition.Item key={1} label="Birth">
      {new Date(character.createdAt).toLocaleDateString()}
    </Definition.Item>,
    <Definition.Item key={2} label="Location">
      <Link href="./location" className="text-orange-700">
        {character.location.name}
      </Link>
    </Definition.Item>,
    <Definition.Item key={3} label="Status">
      {character.status}
    </Definition.Item>,
  ];
}

function CharacterResources({ characterId }: { characterId: number }) {
  const query = useQuery({
    queryKey: client.characters.resources.queryKey(characterId),
    queryFn: () => client.characters.resources.get(characterId),
  });

  if (query.isLoading) {
    return <Definition.Item label="Loading..." />;
  }

  if (!query.data) {
    return null;
  }

  const resources = query.data.payload;

  return resources.map((resource) => (
    <Definition.Item label={resource.spec.name} key={resource.id}>
      {resource.level}/{resource.cap}
    </Definition.Item>
  ));
}

function CharacterSkills({ characterId }: { characterId: number }) {
  const query = useQuery({
    queryKey: client.characters.skills.queryKey(characterId),
    queryFn: () => client.characters.skills.get(characterId),
  });

  if (query.isLoading) {
    return [
      <Definition.Item key={0} label="Loading...">
        Loading...
      </Definition.Item>,
      <Definition.Item key={1} label="Loading...">
        Loading...
      </Definition.Item>,
      <Definition.Item key={2} label="Loading...">
        Loading...
      </Definition.Item>,
    ];
  }

  if (!query.data) {
    return null;
  }

  const skills = query.data.payload;

  return (
    <Definition.List>
      {skills.map((skill) => (
        <Definition.Item label={skill.spec.name} key={skill.id}>
          {fmt.number(skill.level, {
            style: "percent",
            maximumFractionDigits: 0,
          })}
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
    <main className="flex flex-col gap-12">
      <Header characterId={characterId} />

      <section className="flex flex-col gap-1.5">
        <Heading variant="small" asChild>
          <h2>Summary</h2>
        </Heading>

        <Definition.List>
          <CharacterStats characterId={characterId} />
          <CharacterResources characterId={characterId} />
        </Definition.List>
      </section>

      <section className="flex flex-col gap-1.5">
        <Heading variant="small" asChild>
          <h2>Skills</h2>
        </Heading>

        <CharacterSkills characterId={characterId} />
      </section>
    </main>
  );
}
