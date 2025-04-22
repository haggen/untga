import { ReactNode } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "p-3 rounded-sm border mix-blend-multiply",
  variants: {
    type: {
      neutral: "bg-sky-100 text-sky-800 border-sky-800/10",
      positive: "bg-lime-100 text-lime-800 border-lime-800/10",
      negative: "bg-red-100 text-red-800 border-red-800/10",
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
