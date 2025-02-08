import { to } from "@/lib/conversion";
import db from "@/lib/database";
import { format } from "@/lib/format";
import { requireActiveSession } from "@/lib/session";
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

  const tick = await db.tick.findFirstOrThrow({
    orderBy: { id: "desc" },
  });

  const character = await db.character.findUniqueOrThrow({
    where: { id: characterId, userId: session.user.id },
  });

  return (
    <main>
      <dl className="grid grid-cols-2 gap-2">
        <dt>Time</dt>
        <dd>
          {format(to(tick.elapsed, "days"), {
            maximumFractionDigits: 0,
            singular: "day passed",
            plural: "days passed",
          })}
        </dd>
        <dt>Name</dt>
        <dd>{character.name}</dd>
        <dt>Age</dt>
        <dd>
          {format(to(character.age, "years"), {
            maximumFractionDigits: 0,
            singular: "year",
          })}
        </dd>
      </dl>
    </main>
  );
}
