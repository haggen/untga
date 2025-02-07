import { Link } from "@/components/Link";
import prisma from "@/lib/prisma";
import { deleteSessionCookie, getActiveSession } from "@/lib/session";
import { DateTime } from "luxon";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const session = await getActiveSession();

  if (!session) {
    redirect("/sign-in");
  }

  const handleSignOut = async () => {
    "use server";

    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        expiresAt: DateTime.now().toJSDate(),
      },
    });

    await deleteSessionCookie();

    redirect("/");
  };

  return (
    <div className="flex flex-col gap-12 p-6 md:p-12">
      <header>
        <nav className="flex items-center justify-between">
          <Link href="/">
            <hgroup className="flex items-baseline gap-2 font-bold">
              <h1 className="text-2xl">Untitled Game</h1>
              <h2 className="text-sm">A text based browser RPG.</h2>
            </hgroup>
          </Link>

          <ul className="flex gap-6">
            <li>
              <Link href="/account">Account</Link>
            </li>
            <li>
              <Link asChild>
                <button type="button" onClick={handleSignOut}>
                  Sign out
                </button>
              </Link>
            </li>
          </ul>
        </nav>

        <hr />
      </header>

      {children}
    </div>
  );
}
