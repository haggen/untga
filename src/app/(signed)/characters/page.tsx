import prisma from "@/lib/prisma";
import { requireActiveSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await requireActiveSession();

  const character = await prisma.character.findFirst({
    where: { userId: session.user.id },
  });

  if (!character) {
    return redirect("/characters/create");
  }

  redirect(`/characters/${character.id}`);
}
