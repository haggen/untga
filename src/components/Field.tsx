import { Children, cloneElement, ReactElement, useId } from "react";

type Props = {
  label: string;
  children: ReactElement<{ id: string; name?: string }>;
  hint?: string;
  error?: string[];
  name?: string;
};

export function Field({ label, children, hint, error, name }: Props) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-bold">
        {label}
      </label>
      {cloneElement(Children.only(children), { id, name })}
      {hint ? <small className="text-stone-500">{hint}</small> : null}
      {error ? <small className="text-red-500">{error.join()}</small> : null}
    </div>
  );
}
