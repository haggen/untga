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
    <div className="flex flex-col grow">
      {props.editing}
      {props.deletion}
    </div>
  );
}
