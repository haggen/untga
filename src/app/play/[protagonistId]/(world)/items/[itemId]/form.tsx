"use client";

import { Alert } from "~/components/alert";
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
  return character.slots.some((slot) => {
    return slot.items.some((item) => {
      return item.id === itemId;
    });
  });
}

export function Form(
  props: Readonly<{
    equip: StatefulAction<unknown, ActionState>;
    unequip: StatefulAction<unknown, ActionState>;
    item: Serialized<Item<WithSpec>>;
    protagonist: Serialized<Character<WithSlots<WithStorage>>>;
  }>
) {
  const equip = useStatefulActionState(props.equip);
  const unequip = useStatefulActionState(props.unequip);

  return (
    <form className="flex flex-col gap-6">
      <Alert state={equip.state} />
      <Alert state={unequip.state} />

      <Menu.List>
        {isEquipped(props.protagonist, props.item.id) ? (
          <Menu.Item action={unequip.action}>Unequip</Menu.Item>
        ) : props.item.spec.tags.includes(tags.Equipment) ? (
          <Menu.Item action={equip.action}>Equip</Menu.Item>
        ) : null}
      </Menu.List>
    </form>
  );
}
