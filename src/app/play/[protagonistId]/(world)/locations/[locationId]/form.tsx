"use client";

import { Alert } from "~/components/Alert";
import * as Menu from "~/components/Menu";
import { ActionState, StatefulAction } from "~/lib/actions";
import { useStatefulActionState } from "~/lib/use-stateful-action-state";

export function Form(
  props: Readonly<{
    travel: StatefulAction<unknown, ActionState>;
  }>
) {
  const travel = useStatefulActionState(props.travel);

  return (
    <form className="flex flex-col gap-6">
      <Alert state={travel.state} />

      <Menu.List>
        <Menu.Item action={travel.action}>Travel</Menu.Item>
      </Menu.List>
    </form>
  );
}
