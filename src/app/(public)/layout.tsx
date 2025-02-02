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

  const handleSignOut = async () => {
    "use server";

    if (!session) {
      return;
    }

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
    <div className="flex flex-col gap-12 md:p-12 p-6">
      <header>
        <nav className="flex justify-between items-center">
          <h1 className="font-bold text-2xl">
            <Link href="/">Untitled Web Game</Link>
          </h1>

          {session ? (
            <ul className="flex gap-6">
              <li>
                <Link asChild>
                  <button type="button" onClick={handleSignOut}>
                    Sign out
                  </button>
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="flex gap-6">
              <li>
                <Link href="/register">Play now, free!</Link>
              </li>
              <li>
                <Link href="/sign-in">Sign in</Link>
              </li>
            </ul>
          )}
        </nav>

        <hr />
      </header>

      {children}
    </div>
  );
}
