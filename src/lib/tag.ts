export const tag = {
  Action: "action",
  Breakable: "breakable",
  Combat: "combat",
  Consumable: "consumable",
  Cost: "cost",
  Craftable: "craftable",
  Crafting: "crafting",
  Currency: "currency",
  Dead: "dead",
  Discard: "discard",
  Drink: "drink",
  Endurance: "endurance",
  Equip: "equip",
  Equipment: "equipment",
  Feet: "feet",
  Food: "food",
  Foraging: "foraging",
  Hands: "hands",
  Head: "head",
  Healing: "healing",
  Health: "health",
  Hostile: "hostile",
  Idle: "idle",
  Legs: "legs",
  Navigation: "navigation",
  NPC: "npc",
  Overgarment: "overgarment",
  Pack: "pack",
  Peaceful: "peaceful",
  Perception: "perception",
  Player: "player",
  Resource: "resource",
  Resting: "resting",
  Route: "route",
  Skill: "skill",
  Speed: "speed",
  Slot: "slot",
  Stackable: "stackable",
  Stamina: "stamina",
  Start: "start",
  Starting: "starting",
  Storage: "storage",
  Tick: "tick",
  Torso: "torso",
  Transaction: "transaction",
  Travel: "travel",
  Travelling: "traveling",
  Trinket: "trinket",
  Unequip: "unequip",
  Unknown: "unknown",
  Use: "use",
  Utility: "utility",
  Waist: "waist",
  Weapon: "weapon",
} as const;

export type tag = typeof tag;

/**
 * Return a copy of tags replaceing targets with replacements.
 */
export function replace(
  tags: string[],
  target: string[],
  replacement: string[]
) {
  return tags.filter((tag) => !target.includes(tag)).concat(replacement);
}

export function getCharacterStatus(character: { tags: string[] }) {
  return (
    [tag.Dead, tag.Idle, tag.Resting, tag.Travelling, tag.Healing].find((tag) =>
      character.tags.includes(tag)
    ) ?? tag.Unknown
  );
}

export function getSlotType(thing: { tags: string[] }) {
  return (
    [
      tag.Head,
      tag.Overgarment,
      tag.Torso,
      tag.Waist,
      tag.Hands,
      tag.Legs,
      tag.Feet,
      tag.Pack,
    ].find((tag) => thing.tags.includes(tag)) ?? tag.Unknown
  );
}

export function getActionType(action: { tags: string[] }) {
  return (
    [tag.Resting, tag.Travel].find((tag) => action.tags.includes(tag)) ??
    tag.Unknown
  );
}

export function getUtilityType(spec: { tags: string[] }) {
  return [tag.Resting].find((tag) => spec.tags.includes(tag)) ?? tag.Unknown;
}
