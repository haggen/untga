"use client";

import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { alert } from "~/components/alert";
import * as Menu from "~/components/menu";
import { Location } from "~/db";
import { ActionState, StatefulAction } from "~/lib/actions";
import { useStatefulActionState } from "~/lib/use-stateful-action-state";

export function Form(
  props: Readonly<{
    action: StatefulAction<
      { characterId: number; locationId: number; action: string },
      ActionState
    >;
    protagonistId: number;
    location: Location;
  }>
) {
  const { action, state } = useStatefulActionState(props.action);
  const router = useRouter();

  const data = {
    characterId: props.protagonistId,
    locationId: props.location.id,
  };

  const back = (event: MouseEvent) => {
    event.preventDefault();
    router.back();
  };

  return (
    <form className="flex flex-col gap-6 p-section">
      {alert(state)}

      <Menu.List>
        <Menu.Item action={action.bind(null, { ...data, action: "travel" })}>
          Travel
        </Menu.Item>
        <Menu.Item href="#" onClick={back}>
          Cancel
        </Menu.Item>
      </Menu.List>
    </form>
  );
}
