import Link from "next/link";
import { ComponentProps, HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "flex items-center bg-neutral-400 min-h-12 p-3 w-full focus-visible:outline-0 hover:bg-neutral-300 focus-visible:bg-neutral-300",
});

export function Item({
  href,
  onClick,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  href?: ComponentProps<typeof Link>["href"];
}) {
  const content = href ? (
    <Link href={href} className={styles({ className })} {...props} />
  ) : onClick ? (
    <button onClick={onClick} className={styles({ className })} {...props} />
  ) : (
    <div className={styles({ className })} {...props}>
      {props.children}
    </div>
  );

  return <li>{content}</li>;
}
