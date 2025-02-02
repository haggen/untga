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
    <div className="flex flex-col">
      <label htmlFor={id} className="font-bold">
        {label}
      </label>
      {cloneElement(Children.only(children), { id, name })}
      {hint ? <small>{hint}</small> : null}
      {error ? <small className="text-red-600">{error.join()}</small> : null}
    </div>
  );
}
