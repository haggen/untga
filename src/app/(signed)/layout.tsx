import { Anchor } from "@/components/Anchor";
import { SessionProvider } from "@/components/SessionProvider";
import { Stack } from "@/components/Stack";
import { getActiveSessionOrRedirect } from "@/lib/session";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const session = await getActiveSessionOrRedirect();

  return (
    <SessionProvider session={session}>
      <Stack gap={10} asChild>
        <div className="p-12 max-w-[48rem] mx-auto">
          <nav className="flex items-center justify-between">
            <Anchor href="/">
              <h1 className="text-xl font-bold">Untga</h1>
            </Anchor>

            <ul className="flex items-center gap-6">
              <li>
                <Anchor href="/characters" activeClassName="text-orange-700">
                  Characters
                </Anchor>
              </li>
              <li>
                <Anchor href="/user" activeClassName="text-orange-700">
                  Profile
                </Anchor>
              </li>
            </ul>
          </nav>

          {children}
        </div>
      </Stack>
    </SessionProvider>
  );
}
