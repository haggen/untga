import { ReactNode } from "react";
import { tv } from "tailwind-variants";
import { ActionState } from "~/lib/actions";

const styles = tv({
  base: "p-3 mix-blend-multiply",
  variants: {
    type: {
      neutral: "bg-sky-200 text-sky-900 ",
      positive: "bg-lime-200 text-lime-900 ",
      negative: "bg-red-200 text-red-900 ",
    },
  },
});

/**
 * Alert box.
 *
 * @param state - Automatic alert type and content for given form state.
 */
export function Alert({
  type = "neutral",
  state,
  children,
}: {
  type?: keyof typeof styles.variants.type;
  state?: ActionState;
  children?: ReactNode;
}) {
  if (state && "error" in state) {
    return <Alert type="negative">{state.error}</Alert>;
  }

  if (state && "message" in state) {
    return <Alert type="positive">{state.message}</Alert>;
  }

  if (!children) {
    return null;
  }

  return (
    <div className={styles({ type })}>
      <div className="line-clamp-4 overflow-scroll">{children}</div>
    </div>
  );
}
