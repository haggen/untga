import * as Definition from "~/components/Definition";
import { Heading } from "~/components/Heading";
import { Header } from "~/components/Protagonist/Header";
import { db } from "~/lib/db";
import { ensure } from "~/lib/ensure";
import { fmt } from "~/lib/fmt";
import { ensureActiveSession } from "~/lib/session";
import { tag } from "~/lib/tag";
import { parse, schemas } from "~/lib/validation";

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
      attribute.spec.tags.includes(tag.Health)
    ),
    "Could not find an attribute tagged as health."
  );

  const stamina = ensure(
    protagonist.attributes.find((attribute) =>
      attribute.spec.tags.includes(tag.Stamina)
    ),
    "Could not find an attribute tagged as stamina."
  );

  const skills = protagonist.attributes.filter((attribute) =>
    attribute.spec.tags.includes(tag.Skill)
  );

  return (
    <div className="grow flex flex-col gap-12">
      <Header character={protagonist} />

      <section className="flex flex-col gap-1.5">
        <Heading size="small" asChild>
          <h2>Summary</h2>
        </Heading>

        <Definition.List>
          <Definition.Item label="Name">{protagonist.name}</Definition.Item>
          <Definition.Item label="Birth">
            {fmt.datetime(protagonist.createdAt, {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </Definition.Item>
          <Definition.Item label="Location">
            {protagonist.location.name}
          </Definition.Item>
          <Definition.Item label="Status">{protagonist.status}</Definition.Item>
          <Definition.Item label="Health">
            {health.level}/{health.cap}
          </Definition.Item>
          <Definition.Item label="Stamina">
            {stamina.level}/{stamina.cap}
          </Definition.Item>
        </Definition.List>
      </section>

      <section className="flex flex-col gap-1.5">
        <Heading size="small" asChild>
          <h2>Skills</h2>
        </Heading>

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
      </section>
    </div>
  );
}
