import { CogIcon, UsersIcon } from "lucide-react";
import { ReactNode } from "react";
import { SessionProvider } from "~/components/SessionProvider";
import { Bar, Tab } from "~/components/simple/Tab";
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
    </SessionProvider>
  );
}
