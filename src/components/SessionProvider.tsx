"use client";

import { Session } from "@/lib/prisma";
import { createContext, ReactNode, useContext } from "react";

type Value = Session<{ include: { user: { omit: { password: true } } } }>;

const SessionContext = createContext<Value | null>(null);

export function useSession() {
  const session = useContext(SessionContext);

  if (!session) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return session;
}

type Props = {
  session: Value;
  children: ReactNode;
};

export function SessionProvider({ session, children }: Props) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
