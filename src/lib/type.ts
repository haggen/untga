import { HTMLAttributes, Ref } from "react";

export type ElementProps = HTMLAttributes<HTMLElement> & {
  ref?: Ref<HTMLElement>;
};
