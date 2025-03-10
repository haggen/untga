import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type DefinitionProps = ComponentProps<"div"> & {
  label: string;
};

export function Definition({
  label,
  children,
  className,
  ...props
}: DefinitionProps) {
  return (
    <div className={twMerge("flex items-center gap-1", className)} {...props}>
      <dt className="flex items-center gap-1 grow after:content after:grow after:border-t-2 after:border-dotted after:border-current/35">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

type ListProps = ComponentProps<"dl">;

export function List({ className, ...props }: ListProps) {
  return (
    <dl className={twMerge("flex flex-col gap-1", className)} {...props} />
  );
}

Definition.List = List;
