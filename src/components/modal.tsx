"use client";

import { ComponentPropsWithRef, Ref, useCallback, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { useExistingRef } from "~/lib/use-existing-ref";

export function useModal(existingRef?: Ref<HTMLDialogElement>) {
  const dialogRef = useExistingRef(existingRef);

  const state = useCallback(() => {
    return dialogRef.current?.open;
  }, [dialogRef]);

  const open = useCallback(() => {
    dialogRef.current?.showModal();
  }, [dialogRef]);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, [dialogRef]);

  const toggle = useCallback(() => {
    if (state()) {
      close();
    } else {
      open();
    }
  }, [state, close, open]);

  return useMemo(
    () => ({
      ref: dialogRef,
      state,
      open,
      close,
      toggle,
    }),
    [dialogRef, state, open, close, toggle]
  );
}

type Props = ComponentPropsWithRef<"dialog">;

/**
 * Modal component. Modal dialogs prevent interaction with the rest of the page.
 */
export function Modal({ className, children, ...props }: Props) {
  return (
    <dialog className={twMerge("m-auto min-w-md", className)} {...props}>
      <div className="p-section">{children}</div>
    </dialog>
  );
}
