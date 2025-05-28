import { CogIcon, UsersIcon } from "lucide-react";
import { ReactNode } from "react";
import { Bar, Tab } from "~/components/tab";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="grow flex flex-col bg-[url(/limestone.jpg)]">
      {children}

      <Bar className="bg-[url(/marble.jpg)]">
        <Tab href="/account/characters" exact={false}>
          <UsersIcon />
          Characters
        </Tab>
        <Tab href="/account/settings">
          <CogIcon />
          Settings
        </Tab>
      </Bar>
    </div>
  );
}
