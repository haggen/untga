import NextLink from "next/link";
import { ComponentPropsWithRef } from "react";

type NextLinkProps = ComponentPropsWithRef<typeof NextLink>;

type Props = NextLinkProps & {
  href?: NextLinkProps["href"];
};

export function Link({ href, ...props }: Props) {
  if (!href) {
    return <a {...props} />;
  }

  return <NextLink href={href} {...props} />;
}
