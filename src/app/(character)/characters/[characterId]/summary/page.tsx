"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { use } from "react";
import { Definition, List } from "~/components/simple/Definition";
import { Heading } from "~/components/simple/Heading";
import { client } from "~/lib/client";
import { fmt } from "~/lib/fmt";
import { parse, schemas } from "~/lib/validation";
import { Header } from "../header";

function CharacterStats({ characterId }: { characterId: number }) {
  const query = useQuery({
    queryKey: client.characters.queryKey(characterId),
    queryFn: () => client.characters.get(characterId),
  });

  if (query.isLoading) {
    return [
      <Definition key={0} label="Name">
        Loading...
      </Definition>,
      <Definition key={1} label="Birth">
        Loading...
      </Definition>,
      <Definition key={2} label="Location">
        Loading...
      </Definition>,
      <Definition key={3} label="Status">
        Loading...
      </Definition>,
    ];
  }

  if (!query.data) {
    return null;
  }

  const character = query.data.payload;

  return [
    <Definition key={0} label="Name">
      {character.name}
    </Definition>,
    <Definition key={1} label="Birth">
      {new Date(character.createdAt).toLocaleDateString()}
    </Definition>,
    <Definition key={2} label="Location">
      <Link href="./location" className="text-orange-700">
        {character.location.name}
      </Link>
    </Definition>,
    <Definition key={3} label="Status">
      {character.status}
    </Definition>,
  ];
}

function CharacterResources({ characterId }: { characterId: number }) {
  const query = useQuery({
    queryKey: client.characters.resources.queryKey(characterId),
    queryFn: () => client.characters.resources.get(characterId),
  });

  if (query.isLoading) {
    return <Definition label="Loading..." />;
  }

  if (!query.data) {
    return null;
  }

  const resources = query.data.payload;

  return resources.map((resource) => (
    <Definition label={resource.spec.name} key={resource.id}>
      {resource.level}/{resource.cap}
    </Definition>
  ));
}

function CharacterSkills({ characterId }: { characterId: number }) {
  const query = useQuery({
    queryKey: client.characters.skills.queryKey(characterId),
    queryFn: () => client.characters.skills.get(characterId),
  });

  if (query.isLoading) {
    return [
      <Definition key={0} label="Loading...">
        Loading...
      </Definition>,
      <Definition key={1} label="Loading...">
        Loading...
      </Definition>,
      <Definition key={2} label="Loading...">
        Loading...
      </Definition>,
    ];
  }

  if (!query.data) {
    return null;
  }

  const skills = query.data.payload;

  return (
    <List>
      {skills.map((skill) => (
        <Definition label={skill.spec.name} key={skill.id}>
          {fmt.number(skill.level, {
            style: "percent",
            maximumFractionDigits: 0,
          })}
        </Definition>
      ))}
    </List>
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

        <List>
          <CharacterStats characterId={characterId} />
          <CharacterResources characterId={characterId} />
        </List>
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
