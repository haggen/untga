import {
  BookOpenTextIcon,
  PackageOpenIcon,
  SignpostIcon,
  UserCircleIcon,
} from "lucide-react";
import { ReactNode } from "react";
import { SessionProvider } from "~/components/SessionProvider";
import * as Tab from "~/components/simple/Tab";
import { serialize } from "~/lib/serializable";
import { ensureActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";

type Props = {
  params: Promise<{ characterId: string }>;
  children: ReactNode;
};

export default async function Layout({ params, children }: Props) {
  const session = await ensureActiveSession(true);

  const { characterId } = parse(await params, {
    characterId: schemas.id,
  });

  return (
    <SessionProvider session={serialize(session)}>
      <div className="grow flex flex-col gap-12">
        <div className="grow">{children}</div>

        <Tab.Bar>
          <Tab.Tab href={`/characters/${characterId}/summary`}>
            <UserCircleIcon /> Summary
          </Tab.Tab>
          <Tab.Tab href={`/characters/${characterId}/equipment`}>
            <PackageOpenIcon /> Equipment
          </Tab.Tab>
          <Tab.Tab href={`/characters/${characterId}/location`}>
            <SignpostIcon /> Location
          </Tab.Tab>
          <Tab.Tab href={`/characters/${characterId}/journal`}>
            <BookOpenTextIcon /> Journal
          </Tab.Tab>
        </Tab.Bar>
      </div>
    </SessionProvider>
  );
}
