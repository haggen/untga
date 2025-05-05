import { CogIcon, UsersIcon } from "lucide-react";
import { ReactNode } from "react";
import { Bar, Tab } from "~/components/tab";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="grow flex flex-col gap-12 px-3 pt-12 pb-3 text-neutral-800 rounded bg-slate-200 bg-[url(/concrete.png),url(/halftone.png)] bg-blend-multiply">
      {children}

      <Bar>
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
