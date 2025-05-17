import {
  BookOpenTextIcon,
  PackageOpenIcon,
  SignpostIcon,
  UserCircleIcon,
} from "lucide-react";
import { ReactNode } from "react";
import * as Tab from "~/components/tab";
import { parse, schemas } from "~/lib/validation";

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ protagonistId: string }>;
}>) {
  const { protagonistId } = parse(await params, {
    protagonistId: schemas.id,
  });

  return (
    <div className="grow flex flex-col bg-[url(/limestone.jpg)]">
      {children}

      <Tab.Bar className="bg-[url(/marble.jpg)]">
        <Tab.Tab href={`/play/${protagonistId}/stats`}>
          <UserCircleIcon /> Stats
        </Tab.Tab>
        <Tab.Tab href={`/play/${protagonistId}/equipment`}>
          <PackageOpenIcon /> Equipment
        </Tab.Tab>
        <Tab.Tab href={`/play/${protagonistId}/location`}>
          <SignpostIcon /> Location
        </Tab.Tab>
        <Tab.Tab href={`/play/${protagonistId}/journal`}>
          <BookOpenTextIcon /> Journal
        </Tab.Tab>
      </Tab.Bar>
    </div>
  );
}
