"use client";

import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { alert } from "~/components/alert";
import * as Menu from "~/components/menu";
import { Character, Item, WithSlots, WithSpec, WithStorage } from "~/db";
import { type Plan } from "~/game/simulation";
import { ActionState, StatefulAction } from "~/lib/actions";
import { Serializable } from "~/lib/serializable";
import { getUtilityType, tag } from "~/lib/tag";
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
    action: StatefulAction<Plan<{ itemId: number }>, ActionState>;
    item: Serializable<Item<WithSpec>>;
    protagonist: Serializable<Character<WithSlots<WithStorage>>>;
  }>
) {
  const { action, state } = useStatefulActionState(props.action);
  const router = useRouter();

  const use = action.bind(null, {
    tags: [getUtilityType(props.item.spec)],
    characterId: props.protagonist.id,
    params: {
      itemId: props.item.id,
    },
  });

  const equip = action.bind(null, {
    tags: [tag.Equip],
    characterId: props.protagonist.id,
    params: {
      itemId: props.item.id,
    },
  });

  const unequip = action.bind(null, {
    tags: [tag.Unequip],
    characterId: props.protagonist.id,
    params: {
      itemId: props.item.id,
    },
  });

  const discard = action.bind(null, {
    tags: [tag.Discard],
    characterId: props.protagonist.id,
    params: {
      itemId: props.item.id,
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
        {isEquipped(props.protagonist, props.item.id) ? (
          <Menu.Item action={unequip}>Take off</Menu.Item>
        ) : props.item.spec.tags.includes(tag.Equipment) ? (
          <Menu.Item action={equip}>Equip</Menu.Item>
        ) : props.item.spec.tags.includes(tag.Utility) ? (
          <Menu.Item action={use}>Use</Menu.Item>
        ) : null}
        <Menu.Item action={discard}>Discard</Menu.Item>
        <Menu.Item href="#" onClick={back}>
          Cancel
        </Menu.Item>
      </Menu.List>
    </form>
  );
}
