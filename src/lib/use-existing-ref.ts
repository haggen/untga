import { Ref, useLayoutEffect, useRef } from "react";

/**
 * Guarantees an element's ref, merging an existing ref if needed.
 */
export function useExistingRef<T extends Element>(existingRef?: Ref<T>) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    if (existingRef) {
      if (typeof existingRef === "function") {
        existingRef(ref.current);
      } else {
        existingRef.current = ref.current;
      }
    }
  }, [existingRef]);

  return ref;
}
