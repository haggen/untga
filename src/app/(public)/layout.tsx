import { ClipboardSignatureIcon, LifeBuoyIcon, LogInIcon } from "lucide-react";
import { ReactNode } from "react";
import { Bar, Tab } from "~/components/simple/Tab";

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  return (
    <div className="grow flex flex-col gap-12 px-3 pt-12 pb-3 text-neutral-800 rounded bg-slate-200 bg-[url(/concrete.png),url(/halftone.png)] bg-blend-multiply">
      <div className="grow">{children}</div>

      <Bar>
        <Tab href="/registration">
          <ClipboardSignatureIcon /> Register
        </Tab>
        <Tab href="/login">
          <LogInIcon /> Log in
        </Tab>
        <Tab href="/recovery">
          <LifeBuoyIcon /> Recovery
        </Tab>
      </Bar>
    </div>
  );
}
