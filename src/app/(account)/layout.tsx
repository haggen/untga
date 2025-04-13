import { CogIcon, UsersIcon } from "lucide-react";
import { ReactNode } from "react";
import { SessionProvider } from "~/components/SessionProvider";
import { Tab } from "~/components/Tab";
import { serializable } from "~/lib/serializable";
import { requireActiveSession } from "~/lib/session";

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const session = await requireActiveSession(true);

  return (
    <SessionProvider session={serializable(session)}>
      <div className="grow flex flex-col gap-12">
        <div className="grow">{children}</div>

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
