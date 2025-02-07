import prisma from "@/lib/prisma";
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

  const character = await prisma.character.findUniqueOrThrow({
    where: { id: characterId, userId: session.user.id },
  });

  return (
    <main>
      <p>Hi, {character.name}!</p>
    </main>
  );
}
