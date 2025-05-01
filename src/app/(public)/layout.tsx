import { ClipboardSignatureIcon, LifeBuoyIcon, LogInIcon } from "lucide-react";
import { ReactNode } from "react";
import { Bar, Tab } from "~/components/simple/Tab";

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  return (
    <div className="grow flex flex-col gap-12">
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
