import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-dvh px-4 md:px-12 max-w-[48rem] mx-auto">
      <div className="flex flex-col gap-6 grow">
        <nav className="flex items-center justify-between h-28">
          <h1 className="text-xl font-bold">
            <Link href="/">Untga</Link>
          </h1>

          <ul className="flex items-center gap-6">
            <li>
              <Link href="/sign-in">Sign-in</Link>
            </li>
            <li>
              <Link href="/registration">Register</Link>
            </li>
          </ul>
        </nav>

        {children}
      </div>

      <footer className="flex items-center justify-center h-40">
        <p className="text-sm">&copy; 2025 Untga. All rights reserved.</p>
      </footer>
    </div>
  );
}
