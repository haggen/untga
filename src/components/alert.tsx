import { ReactNode } from "react";
import { tv } from "tailwind-variants";
import { ActionState } from "~/lib/actions";

const styles = tv({
  base: "p-3 rounded",
  variants: {
    type: {
      neutral: "bg-sky-200/50 text-sky-800 ",
      positive: "bg-lime-200/50 text-lime-800 ",
      negative: "bg-red-200/50 text-red-800 ",
    },
  },
});

/**
 * Alert box.
 */
export function Alert({
  type = "neutral",
  message,
  children,
}: {
  type?: keyof typeof styles.variants.type;
  message?: string;
  children?: ReactNode;
}) {
  const content = message ? (
    <p className="overflow-y-scroll scrollbar-hidden line-clamp-4">
      {children}
    </p>
  ) : (
    children
  );

  if (!content) {
    return null;
  }

  return (
    <div
      className={styles({ type })}
      role="alert"
      aria-live={type === "negative" ? "assertive" : "polite"}
      aria-atomic="true"
    >
      {content}
    </div>
  );
}

/**
 * Automatic alert based on given action state.
 */
export function alert(state: ActionState) {
  if (state && "error" in state) {
    return <Alert type="negative" message={state.error} />;
  }

  if (state && "message" in state) {
    return <Alert type="positive" message={state.message} />;
  }

  return null;
}
