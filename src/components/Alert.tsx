import { ReactNode } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "p-6 rounded inset-ring mix-blend-color-burn",
  variants: {
    type: {
      neutral: "bg-sky-300 text-sky-900 inset-ring-sky-900/10",
      positive: "bg-lime-300 text-lime-900 inset-ring-lime-900/10",
      negative: "bg-red-300 text-red-900 inset-ring-red-900/10",
    },
  },
});

type Props = {
  children?: ReactNode;
  type?: keyof typeof variants.variants.type;
  dump?: unknown;
};

export function Alert({ type = "neutral", children, dump }: Props) {
  if (dump) {
    return (
      <div className={variants({ type })}>
        <pre className="overflow-scroll text-xs">
          {JSON.stringify(dump, null, 2)}
        </pre>
      </div>
    );
  }

  if (!children) {
    return null;
  }

  return <div className={variants({ type })}>{children}</div>;
}
