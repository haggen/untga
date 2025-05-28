import { ReactNode } from "react";

export default function Layout(props: {
  editing: ReactNode;
  deletion: ReactNode;
}) {
  return (
    <div className="flex flex-col grow">
      {props.editing}
      {props.deletion}
    </div>
  );
}
