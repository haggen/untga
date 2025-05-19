import { ClipboardSignatureIcon, LifeBuoyIcon, LogInIcon } from "lucide-react";
import { ReactNode } from "react";
import { Bar, Tab } from "~/components/tab";

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="grow flex flex-col bg-[url(/limestone.jpg)]">
      <div className="grow">{children}</div>

      <Bar className="bg-[url(/marble.jpg)]">
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
