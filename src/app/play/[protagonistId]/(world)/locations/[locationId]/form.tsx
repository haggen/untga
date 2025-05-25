"use client";

import { Alert } from "~/components/alert";
import { Back } from "~/components/back";
import * as Menu from "~/components/menu";
import { ActionState, StatefulAction } from "~/lib/actions";
import { Location } from "~/lib/db";
import { useStatefulActionState } from "~/lib/use-stateful-action-state";

export function Form(
  props: Readonly<{
    action: StatefulAction<
      { characterId: number; destinationId: number; action: string },
      ActionState
    >;
    protagonistId: number;
    location: Location;
  }>
) {
  const { action, state } = useStatefulActionState(props.action);
  const data = {
    characterId: props.protagonistId,
    destinationId: props.location.id,
  };

  return (
    <form className="flex flex-col gap-6 p-section">
      <Alert state={state} />

      <Menu.List>
        <Menu.Item action={action.bind(null, { ...data, action: "travel" })}>
          Travel
        </Menu.Item>

        <Back asChild>
          <Menu.Item href="#">Cancel</Menu.Item>
        </Back>
      </Menu.List>
    </form>
  );
}
