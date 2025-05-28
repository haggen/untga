import { ReactNode } from "react";
import { Heading } from "~/components/heading";

type Props = Readonly<{
  sessions: ReactNode;
  email: ReactNode;
  password: ReactNode;
  quit: ReactNode;
  children: ReactNode;
}>;

export default function Layout(props: Props) {
  return (
    <div className="grow flex flex-col">
      <header className="flex flex-col p-section gap-text">
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
