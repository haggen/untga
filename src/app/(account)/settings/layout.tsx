import { ReactNode } from "react";

export default function Layout(props: {
  sessions: ReactNode;
  email: ReactNode;
  password: ReactNode;
  deletion: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-12">
      {props.sessions}
      {props.email}
      {props.password}
      {props.deletion}
    </div>
  );
}
