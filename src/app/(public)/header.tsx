import { Anchor } from "@/components/Anchor";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function Header({ children }: Props) {
  return (
    <nav className="flex items-center justify-between">
      <Anchor href="/">
        <h1 className="text-xl font-bold">Untga</h1>
      </Anchor>

      {children}
    </nav>
  );
}
