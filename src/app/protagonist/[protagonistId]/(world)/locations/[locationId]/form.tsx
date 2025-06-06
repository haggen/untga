"use client";

import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { alert } from "~/components/alert";
import * as Menu from "~/components/menu";
import { Location } from "~/db";
import { type Plan } from "~/game/simulation";
import { ActionState, StatefulAction } from "~/lib/actions";
import { Serializable } from "~/lib/serializable";
import { tag } from "~/lib/tag";
import { useStatefulActionState } from "~/lib/use-stateful-action-state";

export function Form(
  props: Readonly<{
    action: StatefulAction<Plan<{ destinationId: number }>, ActionState>;
    location: Serializable<Location>;
    protagonist: { id: number };
  }>
) {
  const { action, state } = useStatefulActionState(props.action);
  const router = useRouter();

  const travel = action.bind(null, {
    tags: [tag.Travel],
    characterId: props.protagonist.id,
    params: {
      destinationId: props.location.id,
    },
  });

  const back = (event: MouseEvent) => {
    event.preventDefault();
    router.back();
  };

  return (
    <form className="flex flex-col gap-6 p-section">
      {alert(state)}

      <Menu.List>
        <Menu.Item action={travel}>Travel</Menu.Item>
        <Menu.Item href="#" onClick={back}>
          Cancel
        </Menu.Item>
      </Menu.List>
    </form>
  );
}
