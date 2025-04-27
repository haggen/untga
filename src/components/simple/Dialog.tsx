import {
  HTMLAttributes,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { twMerge } from "tailwind-merge";

export function useDialog(existingRef?: Ref<HTMLDialogElement>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (existingRef) {
      if (typeof existingRef === "function") {
        existingRef(dialogRef.current);
      } else {
        existingRef.current = dialogRef.current;
      }
    }
  }, [existingRef]);

  const state = useCallback(() => {
    return dialogRef.current?.open;
  }, []);

  const open = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

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
    [close, open, state, toggle]
  );
}

export function Dialog({
  ref,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDialogElement> & { ref?: Ref<HTMLDialogElement> }) {
  return (
    <dialog
      ref={ref}
      className={twMerge(
        "w-full h-dvh max-w-md max-h-full mx-auto bg-transparent px-2 pt-9 modal:max-height-auto",
        className
      )}
      {...props}
    >
      <div className="rounded h-full px-3 py-12 flex flex-col gap-12 bg-orange-200 bg-[url(/concrete.png),url(/halftone.png)] bg-blend-multiply">
        {children}
      </div>
    </dialog>
  );
}
