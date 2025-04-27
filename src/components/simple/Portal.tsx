"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Equivalent to ReactDOM.createPortal, but works with SSR.
 * @see https://react.dev/reference/react-dom/createPortal
 */
export function Portal({
  container,
  children,
}: {
  container: Element | undefined | null;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!container) {
    return null;
  }

  return createPortal(children, container);
}
