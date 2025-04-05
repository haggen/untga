import { parse, schemas } from "@/lib/validation";
import { permanentRedirect } from "next/navigation";

type Props = {
  params: Promise<{
    characterId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { characterId } = parse(await params, {
    characterId: schemas.id,
  });

  permanentRedirect(`/characters/${characterId}/summary`);
}
