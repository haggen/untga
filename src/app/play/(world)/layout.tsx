import { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="grow flex flex-col gap-12 px-3 pt-12 pb-3 text-neutral-800 rounded bg-orange-200 bg-[url(/concrete.png),url(/halftone.png)] bg-blend-multiply">
      {children}
    </div>
  );
}
