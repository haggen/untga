export const tags = {
  /** Items that can be consumed/used up. */
  Consumable: "consumable",
  /** The Crafting skill. */
  Crafting: "crafting",
  /** Items that can be used as currency. */
  Currency: "currency",
  /** Items that can be drank. Should be applied with tag.Consumable. */
  Drink: "drink",
  /** Dead character. */
  Dead: "dead",
  /** The Endurance skill. */
  Endurance: "endurance",
  /** Items that can be equipped. */
  Equipment: "equipment",
  /** Type of slot, applied on both items and containers. Items also need tag.Equipment. */
  Feet: "feet",
  /** Items that can be eaten. Should be used with tag.Consumable. */
  Food: "food",
  /** The Foraging skill. */
  Foraging: "foraging",
  /** Type of slot, applied on both items and containers. Items also need tag.Equipment. */
  Hands: "hands",
  /** Type of slot, applied on both items and containers. Items also need tag.Equipment. */
  Head: "head",
  /** A character state. */
  Healing: "healing",
  /** The Health attribute. */
  Health: "health",
  /** Locations where characters can be attacked. */
  Hostile: "hostile",
  /** A character state. */
  Idle: "idle",
  /** Type of slot, applied on both items and containers. Items also need tag.Equipment. */
  Legs: "legs",
  /** The Navigation skill. */
  Navigation: "navigation",
  /** Characters that are not player controlled. */
  NPC: "npc",
  /** Type of slot, applied on both items and containers. Items also need tag.Equipment. */
  Overgarment: "overgarment",
  /** Type of slot, applied on both items and containers. Items also need tag.Equipment. */
  Pack: "pack",
  /** Locations where characters can't be attacked. */
  Peaceful: "peaceful",
  /** The Perception skill. */
  Perception: "perception",
  /** Characters that are player controlled. */
  Player: "player",
  /** Attributes that can be spent and might regenerate. */
  Resource: "resource",
  /** A character state. */
  Resting: "resting",
  /** Locations that connect to other locations. */
  Route: "route",
  /** Attributes that can be trained and modify event outcomes. */
  Skill: "skill",
  /** Type of container. */
  Slot: "slot",
  /** The Stamina attribute. */
  Stamina: "stamina",
  /** Items that can be utilized in some way. */
  Utility: "utility",
  /** Locations, slots, attributes and items that start with the character when it's created. */
  Starting: "starting",
  /** Items that provide storage. */
  Storage: "storage",
  /** Type of slot, applied on both items and containers. Items also need tag.Equipment. */
  Torso: "torso",
  /** A character state. */
  Travelling: "traveling",
  /** Items that have no function (collectables, valuables, etc). */
  Trinket: "trinket",
  /** Type of slot, applied on both items and containers. Items also need tag.Equipment. */
  Waist: "waist",
  /** Items that can be used for combat. */
  Weapon: "weapon",
  /** Unknown trait. */
  Unknown: "unknown",
};

export function replace(
  tags: string[],
  target: string[],
  replacement: string[]
) {
  return tags.filter((tag) => !target.includes(tag)).concat(replacement);
}

export function getCharacterStatus(character: { tags: string[] }) {
  return (
    [tags.Dead, tags.Idle, tags.Resting, tags.Travelling, tags.Healing].find(
      (tag) => character.tags.includes(tag)
    ) ?? tags.Unknown
  );
}

export function getSlotType(thing: { tags: string[] }) {
  return (
    [
      tags.Head,
      tags.Overgarment,
      tags.Torso,
      tags.Waist,
      tags.Hands,
      tags.Legs,
      tags.Feet,
    ].find((tag) => thing.tags.includes(tag)) ?? tags.Unknown
  );
}
