"use client";

import { createContext, ReactNode, useContext } from "react";
import { Session } from "~/lib/db";

type Value = Session<{ include: { user: { omit: { password: true } } } }>;

export const SessionContext = createContext<Value | null>(null);

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
