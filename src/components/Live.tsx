"use client";

import { ReactNode, useEffect, useState } from "react";

type Props<T> = {
  model: string;
  op: string;
  args: unknown;
  children: (data: T) => ReactNode;
};

function rpc<T>(op: string, model: string, args: unknown) {
  return fetch("/api/rpc", {
    method: "POST",
    body: JSON.stringify({ model, op, args }),
  }).then((resp) => {
    if (!resp.ok) {
      throw new Error("Network response was not ok");
    }
    return resp.json() as Promise<T>;
  });
}

export function Live<T>({ model, op, args, children }: Props<T>) {
  const [data, setData] = useState<T>();

  useEffect(() => {
    const intervalId = setInterval(() => {
      rpc<T>(op, model, args).then((data) => {
        setData(data);
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [args, model, op]);

  if (!data) {
    return <>Loading...</>;
  }

  return <>{children(data)}</>;
}
