import db, { Prisma } from "@/lib/database";

function getActionStartDescription(
  action: Prisma.ActionGetPayload<{ include: { character: true } }>
) {
  switch (action.name) {
    case "walk":
      return `I started my ${action.duration} hour walk.`;
    default:
      return `Action started: ${action.name}`;
  }
}

function getActionCompleteDescription(
  action: Prisma.ActionGetPayload<{ include: { character: true } }>
) {
  switch (action.name) {
    case "walk":
      return `I just got back from my ${action.duration} hour walk.`;
    default:
      return `Action completed: ${action.name}`;
  }
}

export async function POST() {
  const lastTick = await db.tick.findFirstOrThrow({
    orderBy: { id: "desc" },
  });

  // Game time is tracked in hours.
  const delta = 1;

  /** Current game time. */
  const epoch = lastTick.epoch + delta;

  const tick = await db.tick.create({
    data: {
      delta,
      epoch,
    },
  });

  const characters = await db.character.findMany({
    orderBy: { id: "asc" },
  });

  // Walk over characters and update their age.
  for (const character of characters) {
    await db.character.update({
      where: { id: character.id },
      data: { age: { increment: delta } },
    });

    // Grab the oldest action by the character that is pending.
    const action = await db.action.findFirst({
      where: {
        characterId: character.id,
        ...db.action.pending(),
      },
      orderBy: { id: "asc" },
      include: {
        character: true,
      },
    });

    if (action) {
      // If it hasn't started, start it.
      if (action.startedAtEpoch === null) {
        await db.action.update({
          where: { id: action.id },
          data: { startedAtEpoch: epoch },
        });

        await db.journal.create({
          data: {
            writtenAtEpoch: epoch,
            characterId: character.id,
            description: getActionStartDescription(action),
          },
        });

        // If it has started but hasn't been completed, check if it's time to complete it.
      } else {
        if (epoch - action.startedAtEpoch >= action.duration) {
          await db.action.update({
            where: { id: action.id },
            data: { completedAtEpoch: epoch },
          });

          await db.journal.create({
            data: {
              writtenAtEpoch: epoch,
              characterId: character.id,
              description: getActionCompleteDescription(action),
            },
          });
        }
      }
    }
  }

  return Response.json(tick, { status: 201 });
}
