import { Metadata } from "next";
import { ReactNode } from "react";
import { Heading } from "~/components/heading";

export const metadata: Metadata = {
  title: "Account",
};

export default function Layout(props: {
  sessions: ReactNode;
  email: ReactNode;
  password: ReactNode;
  quit: ReactNode;
}) {
  return (
    <div className="grow flex flex-col gap-12">
      <header className="flex flex-col gap-1.5">
        <Heading size="large" asChild>
          <h1>Account</h1>
        </Heading>
        <p>Manage your account.</p>
      </header>

      {props.sessions}
      {props.email}
      {props.password}
      {props.quit}
    </div>
  );
}
