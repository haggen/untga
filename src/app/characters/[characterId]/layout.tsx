import { SessionProvider } from "@/components/SessionProvider";
import { Tab } from "@/components/Tab";
import { serializable } from "@/lib/serializable";
import { requireActiveSession } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import {
  BookOpenTextIcon,
  PackageOpenIcon,
  SignpostIcon,
  UserCircleIcon,
} from "lucide-react";
import { ReactNode } from "react";

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

        <Tab.Bar>
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
        </Tab.Bar>
      </div>
    </SessionProvider>
  );
}
