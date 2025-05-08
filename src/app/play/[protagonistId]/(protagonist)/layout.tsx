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
    <div className="grow flex flex-col gap-12 p-3 text-neutral-800 rounded bg-slate-300 bg-[url(/concrete.png),url(/halftone.png)] bg-blend-multiply">
      {children}

      <Tab.Bar>
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
