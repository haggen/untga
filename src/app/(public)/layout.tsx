import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return <div className="p-6 md:p-12 max-w-[32rem] mx-auto">{children}</div>;
}
