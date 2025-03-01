import { Children, cloneElement, ReactElement, useId } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label?: string;
  children: ReactElement<{ id: string; name?: string }>;
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

  return (
    <div className={twMerge("flex flex-col gap-0.5", className)}>
      {label ? (
        <label htmlFor={id} className="font-bold">
          {label}
        </label>
      ) : null}

      {cloneElement(Children.only(children), { id, name })}

      {hint ? <small>{hint}</small> : null}

      {error ? <small className="text-red-800">{error.join()}</small> : null}
    </div>
  );
}
