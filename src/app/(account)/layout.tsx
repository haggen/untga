import { SessionProvider } from "@/components/SessionProvider";
import { Tab } from "@/components/Tab";
import { serializable } from "@/lib/serializable";
import { getActiveSessionOrRedirect } from "@/lib/session";
import { CogIcon, UsersIcon } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const session = await getActiveSessionOrRedirect();

  return (
    <SessionProvider session={serializable(session)}>
      <div className="grow flex flex-col gap-12">
        {children}

        <Tab.Bar>
          <Tab href="/characters">
            <UsersIcon />
            Characters
          </Tab>
          <Tab href="/settings">
            <CogIcon />
            Settings
          </Tab>
        </Tab.Bar>
      </div>
    </SessionProvider>
  );
}
