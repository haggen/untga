"use client";

import { getQueryClient } from "@/lib/queryClient";
import { QueryClientProvider as Provider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";

type Props = { children: ReactNode };

export default function QueryClientProvider({ children }: Props) {
  const queryClient = getQueryClient();

  return (
    <Provider client={queryClient}>
      {children}

      <ReactQueryDevtools />
    </Provider>
  );
}
