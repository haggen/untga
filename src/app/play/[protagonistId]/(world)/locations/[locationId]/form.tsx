"use client";

import { Alert } from "~/components/alert";
import { Back } from "~/components/back";
import * as Menu from "~/components/menu";
import { ActionState, StatefulAction } from "~/lib/actions";
import { useStatefulActionState } from "~/lib/use-stateful-action-state";

export function Form(
  props: Readonly<{
    travel: StatefulAction<unknown, ActionState>;
  }>
) {
  const travel = useStatefulActionState(props.travel);

  return (
    <form className="flex flex-col gap-6 p-section">
      <Alert state={travel.state} />

      <Menu.List>
        <Menu.Item action={travel.action}>Travel</Menu.Item>

        <Back asChild>
          <Menu.Item href="#">Cancel</Menu.Item>
        </Back>
      </Menu.List>
    </form>
  );
}
