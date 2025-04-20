import { ClipboardSignatureIcon, KeyIcon, LogInIcon } from "lucide-react";
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
        <Tab href="/register">
          <ClipboardSignatureIcon /> Register
        </Tab>
        <Tab href="/login">
          <LogInIcon /> Log in
        </Tab>
        <Tab href="/recovery">
          <KeyIcon /> Recovery
        </Tab>
      </Bar>
    </div>
  );
}
