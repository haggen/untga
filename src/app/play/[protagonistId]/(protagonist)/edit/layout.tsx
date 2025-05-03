import { ReactNode } from "react";

export default function Layout(props: {
  editing: ReactNode;
  deletion: ReactNode;
}) {
  return (
    <div className="grow flex flex-col gap-12">
      {props.editing}
      {props.deletion}
    </div>
  );
}
