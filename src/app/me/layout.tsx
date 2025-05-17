import { CogIcon, UsersIcon } from "lucide-react";
import { ReactNode } from "react";
import { Bar, Tab } from "~/components/tab";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="grow flex flex-col bg-[url(/limestone.jpg)]">
      {children}

      <Bar className="bg-[url(/marble.jpg)]">
        <Tab href="/me/characters" exact={false}>
          <UsersIcon />
          Characters
        </Tab>
        <Tab href="/me/account">
          <CogIcon />
          Settings
        </Tab>
      </Bar>
    </div>
  );
}
