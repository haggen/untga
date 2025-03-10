import { Anchor } from "@/components/Anchor";
import { Group } from "@/components/Group";
import { SessionProvider } from "@/components/SessionProvider";
import { getActiveSessionOrRedirect } from "@/lib/session";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const session = await getActiveSessionOrRedirect();

  return (
    <SessionProvider session={JSON.parse(JSON.stringify(session))}>
      <Group depth={1} asChild>
        <div className="p-6 md:p-12 max-w-[48rem] mx-auto">
          <nav className="flex items-center justify-between">
            <Anchor href="/">
              <h1 className="text-xl font-bold">Untga</h1>
            </Anchor>

            <ul className="flex items-center gap-6">
              <li>
                <Anchor href="/characters" activeClassName="text-orange-900">
                  Characters
                </Anchor>
              </li>
              <li>
                <Anchor href="/profile" activeClassName="text-orange-900">
                  Profile
                </Anchor>
              </li>
            </ul>
          </nav>

          {children}
        </div>
      </Group>
    </SessionProvider>
  );
}
