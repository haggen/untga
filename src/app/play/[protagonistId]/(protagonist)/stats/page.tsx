import { Metadata } from "next";
import * as Definition from "~/components/definition";
import { Heading } from "~/components/heading";
import { Header } from "~/components/protagonist/header";
import { db } from "~/lib/db";
import { ensure } from "~/lib/ensure";
import { fmt } from "~/lib/fmt";
import { ensureActiveSession } from "~/lib/session";
import { tags } from "~/lib/tags";
import { parse, schemas } from "~/lib/validation";

export const metadata: Metadata = {
  title: "Character's stats",
};

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ protagonistId: string }>;
}>) {
  const { protagonistId } = parse(await params, {
    protagonistId: schemas.id,
  });

  const session = await ensureActiveSession(true);

  const protagonist = await db.character.findUniqueOrThrow({
    where: { id: protagonistId, userId: session.userId },
    include: {
      location: true,
      attributes: {
        include: {
          spec: true,
        },
        orderBy: { spec: { name: "asc" } },
      },
    },
  });

  const health = ensure(
    protagonist.attributes.find((attribute) =>
      attribute.spec.tags.includes(tags.Health)
    ),
    "Could not find an attribute tagged as health."
  );

  const stamina = ensure(
    protagonist.attributes.find((attribute) =>
      attribute.spec.tags.includes(tags.Stamina)
    ),
    "Could not find an attribute tagged as stamina."
  );

  const skills = protagonist.attributes.filter((attribute) =>
    attribute.spec.tags.includes(tags.Skill)
  );

  return (
    <div className="flex flex-col grow">
      <Header character={protagonist} />

      <section className="flex flex-col gap-2 p-section">
        <Heading size="small" asChild>
          <h1>Summary</h1>
        </Heading>

        <Definition.List>
          <Definition.Item label="Name">{protagonist.name}</Definition.Item>
          <Definition.Item label="Age">
            {fmt.character.age(protagonist.createdAt)}
          </Definition.Item>
          <Definition.Item label="Location">
            {protagonist.location.name}
          </Definition.Item>
          <Definition.Item label="Status">
            {fmt.string(protagonist.status, { title: true })}
          </Definition.Item>
          <Definition.Item label="Health">
            {fmt.character.health(health.level)}
          </Definition.Item>
          <Definition.Item label="Stamina">
            {fmt.character.stamina(stamina.level)}
          </Definition.Item>
        </Definition.List>
      </section>

      <section className="flex flex-col gap-2 p-section">
        <Heading size="small" asChild>
          <h1>Skills</h1>
        </Heading>

        <Definition.List>
          {skills.map((skill) => (
            <Definition.Item key={skill.id} label={skill.spec.name}>
              {fmt.character.skill(skill.level)}
            </Definition.Item>
          ))}
        </Definition.List>
      </section>
    </div>
  );
}
