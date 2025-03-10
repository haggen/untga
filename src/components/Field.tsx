import { cloneElement, ReactElement, ReactNode, useId } from "react";
import { twMerge } from "tailwind-merge";

type ControlElement = ReactElement<{
  id: string;
  name?: string;
  className?: string;
}>;

type Props = {
  label?: string;
  children: ControlElement | [ControlElement, ...ReactNode[]];
  hint?: string;
  error?: string[];
  name?: string;
  className?: string;
};

export function Field({
  label,
  children,
  hint,
  error,
  name,
  className,
}: Props) {
  const id = useId();

  const [control, ...extra] = Array.isArray(children) ? children : [children];

  return (
    <div className={twMerge("flex flex-col gap-0.5", className)}>
      {label ? (
        <label htmlFor={id} className="font-bold">
          {label}
        </label>
      ) : null}

      <div className="flex items-center gap-2">
        {cloneElement(control, { id, name, className: "grow" })}
        {extra}
      </div>

      {hint ? <small>{hint}</small> : null}

      {error ? <small className="text-red-800">{error.join()}</small> : null}
    </div>
  );
}
