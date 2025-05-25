"use client";

import { Alert } from "~/components/alert";
import { Back } from "~/components/back";
import * as Menu from "~/components/menu";
import { ActionState, StatefulAction } from "~/lib/actions";
import { Character, Item, WithSlots, WithSpec, WithStorage } from "~/lib/db";
import { Serialized } from "~/lib/serializable";
import { tags } from "~/lib/tags";
import { useStatefulActionState } from "~/lib/use-stateful-action-state";

function isEquipped(
  character: Serialized<Character<WithSlots>>,
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
    item: Serialized<Item<WithSpec>>;
    protagonist: Serialized<Character<WithSlots<WithStorage>>>;
  }>
) {
  const { action, state } = useStatefulActionState(props.action);
  const data = {
    itemId: props.item.id,
    characterId: props.protagonist.id,
  };

  return (
    <form className="flex flex-col gap-6 p-section">
      <Alert state={state} />

      <Menu.List>
        {isEquipped(props.protagonist, props.item.id) ? (
          <Menu.Item action={action.bind(null, { ...data, action: "unequip" })}>
            Take off
          </Menu.Item>
        ) : props.item.spec.tags.includes(tags.Equipment) ? (
          <Menu.Item action={action.bind(null, { ...data, action: "equip" })}>
            Equip
          </Menu.Item>
        ) : null}
        {props.item.spec.tags.includes(tags.Utility) ? (
          <Menu.Item action={action.bind(null, { ...data, action: "use" })}>
            Use
          </Menu.Item>
        ) : null}
        <Menu.Item action={action.bind(null, { ...data, action: "discard" })}>
          Discard
        </Menu.Item>
        <Back asChild>
          <Menu.Item href="#">Cancel</Menu.Item>
        </Back>
      </Menu.List>
    </form>
  );
}
