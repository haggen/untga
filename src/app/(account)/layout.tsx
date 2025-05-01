import { CogIcon, UsersIcon } from "lucide-react";
import { ReactNode } from "react";
import { Bar, Tab } from "~/components/simple/Tab";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-12 grow">
      <div className="grow">{children}</div>

      <Bar>
        <Tab href="/characters" exact={false}>
          <UsersIcon />
          Characters
        </Tab>
        <Tab href="/settings">
          <CogIcon />
          Settings
        </Tab>
      </Bar>
    </div>
  );
}
