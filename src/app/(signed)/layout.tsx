import { SessionProvider } from "@/components/SessionProvider";
import { getActiveSessionOrRedirect } from "@/lib/session";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const session = await getActiveSessionOrRedirect();

  return (
    <SessionProvider session={JSON.parse(JSON.stringify(session))}>
      <div className="flex flex-col min-h-dvh px-4 md:px-12 max-w-[48rem] mx-auto">
        <div className="flex flex-col gap-6 grow">
          <nav className="flex items-center justify-between h-20">
            <h1 className="text-xl font-bold">
              <Link href="/">Untga</Link>
            </h1>

            <ul className="flex items-center gap-6">
              <li>
                <Link href="/characters">Characters</Link>
              </li>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
            </ul>
          </nav>

          {children}
        </div>

        <footer className="flex items-center justify-center h-40">
          <p className="text-sm">&copy; 2025 Untga. All rights reserved.</p>
        </footer>
      </div>
    </SessionProvider>
  );
}
