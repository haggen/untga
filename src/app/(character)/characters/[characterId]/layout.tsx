import {
  BookOpenTextIcon,
  PackageOpenIcon,
  SignpostIcon,
  UserCircleIcon,
} from "lucide-react";
import { ReactNode } from "react";
import { SessionProvider } from "~/components/SessionProvider";
import { Bar, Tab } from "~/components/simple/Tab";
import { serializable } from "~/lib/serializable";
import { requireActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";

type Props = {
  params: Promise<{ characterId: string }>;
  children: ReactNode;
};

export default async function Layout({ params, children }: Props) {
  const session = await requireActiveSession(true);

  const { characterId } = parse(await params, {
    characterId: schemas.id,
  });

  return (
    <SessionProvider session={serializable(session)}>
      <div className="grow flex flex-col gap-12">
        <div className="grow">{children}</div>

        <Bar>
          <Tab href={`/characters/${characterId}/summary`}>
            <UserCircleIcon /> Summary
          </Tab>
          <Tab href={`/characters/${characterId}/equipment`}>
            <PackageOpenIcon /> Equipment
          </Tab>
          <Tab href={`/characters/${characterId}/location`}>
            <SignpostIcon /> Location
          </Tab>
          <Tab href={`/characters/${characterId}/journal`}>
            <BookOpenTextIcon /> Journal
          </Tab>
        </Bar>
      </div>
    </SessionProvider>
  );
}
