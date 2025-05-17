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
    <div className="grow flex flex-col">
      <header className="flex flex-col p-section">
        <Heading size="large" asChild>
          <h1>Settings</h1>
        </Heading>
        <p>Manage your account settings.</p>
      </header>

      {props.sessions}
      {props.email}
      {props.password}
      {props.quit}
    </div>
  );
}
