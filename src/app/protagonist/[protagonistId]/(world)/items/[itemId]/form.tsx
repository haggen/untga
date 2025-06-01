"use client";

import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { alert } from "~/components/alert";
import * as Menu from "~/components/menu";
import { Character, Item, WithSlots, WithSpec, WithStorage } from "~/db";
import { ActionState, StatefulAction } from "~/lib/actions";
import { Serializable } from "~/lib/serializable";
import { tag } from "~/lib/tags";
import { useStatefulActionState } from "~/lib/use-stateful-action-state";

function isEquipped(
  character: Serializable<Character<WithSlots>>,
  itemId: number
) {
  return character.slots.some((slot) =>
    slot.items.some((item) => item.id === itemId)
  );
}

export function Form(
  props: Readonly<{
    action: StatefulAction<
      { characterId: number; itemId: number; action: string },
      ActionState
    >;
    item: Serializable<Item<WithSpec>>;
    protagonist: Serializable<Character<WithSlots<WithStorage>>>;
  }>
) {
  const { action, state } = useStatefulActionState(props.action);
  const router = useRouter();

  const data = {
    itemId: props.item.id,
    characterId: props.protagonist.id,
  };

  const back = (event: MouseEvent) => {
    event.preventDefault();
    router.back();
  };

  return (
    <form className="flex flex-col gap-6 p-section">
      {alert(state)}

      <Menu.List>
        {isEquipped(props.protagonist, props.item.id) ? (
          <Menu.Item action={action.bind(null, { ...data, action: "unequip" })}>
            Take off
          </Menu.Item>
        ) : props.item.spec.tags.includes(tag.Equipment) ? (
          <Menu.Item action={action.bind(null, { ...data, action: "equip" })}>
            Equip
          </Menu.Item>
        ) : null}
        {props.item.spec.tags.includes(tag.Utility) ? (
          <Menu.Item action={action.bind(null, { ...data, action: "use" })}>
            Use
          </Menu.Item>
        ) : null}
        <Menu.Item action={action.bind(null, { ...data, action: "discard" })}>
          Discard
        </Menu.Item>
        <Menu.Item href="#" onClick={back}>
          Cancel
        </Menu.Item>
      </Menu.List>
    </form>
  );
}
