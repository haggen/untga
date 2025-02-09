import { to } from "@/lib/conversion";
import db from "@/lib/database";
import { format } from "@/lib/format";
import { requireActiveSession } from "@/lib/session";
import { Fragment } from "react";
import { z } from "zod";

const schema = z.object({
  id: z.coerce.number().gt(0),
});

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const session = await requireActiveSession();

  const { id: characterId } = schema.parse(await params);

  const tick = await db.tick.latest();

  const character = await db.character.findUniqueOrThrow({
    where: { id: characterId, userId: session.user.id },
    include: {
      journal: {
        orderBy: { id: "desc" },
      },
    },
  });

  const lastAction = await db.action.findFirst({
    where: { characterId: character.id },
    orderBy: { id: "desc" },
  });

  async function takeAWalk({
    characterId,
    duration,
  }: {
    characterId: number;
    duration: number;
  }) {
    "use server";

    await db.action.create({
      data: {
        characterId,
        name: "walk",
        duration,
      },
    });
  }

  function formatEpoch(epoch: number) {
    return `${format(to(epoch, "days"), {
      maximumFractionDigits: 0,
      singular: "day",
    })} ${format(epoch % 24, {
      maximumFractionDigits: 0,
      singular: "hour",
    })}`;
  }

  return (
    <main className="flex flex-col gap-12">
      <dl className="grid grid-cols-2 gap-3">
        <dt>Time since the world was created</dt>
        <dd>{formatEpoch(tick.epoch)}</dd>
        <dt>Name</dt>
        <dd>{character.name}</dd>
        <dt>Age</dt>
        <dd>
          {format(to(character.age, "years"), {
            maximumFractionDigits: 0,
            singular: "year",
          })}
        </dd>
        <dt>Last action</dt>
        <dd>
          {lastAction
            ? `${lastAction.name} (${lastAction.duration}) (${lastAction.status})`
            : "-"}
        </dd>
      </dl>

      <menu className="flex gap-6 font-bold">
        <li>
          <button
            onClick={takeAWalk.bind(null, {
              characterId: character.id,
              duration: 1,
            })}
          >
            Take a 1 hour walk
          </button>
        </li>
        <li>
          <button
            onClick={takeAWalk.bind(null, {
              characterId: character.id,
              duration: 2,
            })}
          >
            Take a 2 hour walk
          </button>
        </li>
      </menu>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl">Journal</h2>

        <dl className="grid grid-cols-2 gap-3">
          {character.journal.map((entry) => (
            <Fragment key={entry.id}>
              <dt>{formatEpoch(entry.writtenAtEpoch)}</dt>
              <dd>{entry.description}</dd>
            </Fragment>
          ))}
        </dl>
      </section>
    </main>
  );
}
