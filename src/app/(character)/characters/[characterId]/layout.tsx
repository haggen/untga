import { SessionProvider } from "@/components/SessionProvider";
import { Tab } from "@/components/Tab";
import { serializable } from "@/lib/serializable";
import { getActiveSessionOrRedirect } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import {
  BookOpenIcon,
  LogOutIcon,
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
  const session = await getActiveSessionOrRedirect();

  const { characterId } = parse(await params, {
    characterId: schemas.id,
  });

  return (
    <SessionProvider session={serializable(session)}>
      <div className="grow flex flex-col gap-12">
        {children}

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
            <BookOpenIcon /> Journal
          </Tab>
          <Tab href="/characters">
            <LogOutIcon /> Log out
          </Tab>
        </Tab.Bar>
      </div>
    </SessionProvider>
  );
}
