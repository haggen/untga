import { Link } from "@/components/Link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
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
              <Link href="/register">Play now, free!</Link>
            </li>
            <li>
              <Link href="/sign-in">Sign in</Link>
            </li>
          </ul>
        </nav>

        <hr />
      </header>

      {children}
    </div>
  );
}
