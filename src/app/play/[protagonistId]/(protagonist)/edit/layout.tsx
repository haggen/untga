import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Editing character",
};

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
