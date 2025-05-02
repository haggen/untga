import { ReactNode } from "react";

export default function Layout(props: {
  sessions: ReactNode;
  changeEmail: ReactNode;
  changePassword: ReactNode;
  quit: ReactNode;
}) {
  return (
    <main className="grow flex flex-col gap-12">
      {props.sessions}
      {props.changeEmail}
      {props.changePassword}
      {props.quit}
    </main>
  );
}
