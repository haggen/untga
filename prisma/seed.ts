import { db, Prisma } from "@/lib/db";
import * as tags from "@/static/tags";

async function createLocations(
  data: { name: string; description: string; tags: string[]; exits: string[] }[]
) {
  const locations = await db.location.createManyAndReturn({
    data: data.map((location) => ({
      name: location.name,
      description: location.description,
      tags: location.tags,
    })),
  });

  const routes: Prisma.RouteUncheckedCreateInput[] = [];

  data.forEach((data) => {
    const location = locations.find((location) => location.name === data.name);

    if (!location) {
      throw new Error(`Can't find location ${data.name}.`);
    }

    data.exits.forEach((name) => {
      const exit = locations.find((location) => location.name === name);

      if (!exit) {
        throw new Error(`Can't find location ${name}.`);
      }

      routes.push({
        entryId: location.id,
        exitId: exit.id,
      });
    });
  });

  await db.route.createManyAndReturn({
    data: routes,
  });
}

async function seed() {
  const locations = [
    {
      name: "Hearthmere Village",
      description:
        "A quiet farming village nestled in a wooded hollow. Known for its warm hearths and honest folk.",
      tags: [tags.Peaceful, tags.StartingLocation],
      exits: ["Stonefield Market", "Dunhollow Crossroads"],
    },
    {
      name: "Stonefield Market",
      description:
        "A bustling roadside town with open-air stalls, smiths, and stables. Trade thrives under the watchful eye of the reeve.",
      tags: [tags.Peaceful],
      exits: ["Hearthmere Village", "Dunhollow Crossroads"],
    },
    {
      name: "Dunhollow Crossroads",
      description:
        "A central meeting point for travelers and merchants. Inns, gossip, and coin change hands swiftly here.",
      tags: [tags.Peaceful],
      exits: [
        "Hearthmere Village",
        "Stonefield Market",
        "Redbarrow Ruins",
        "Black Fen Marshes",
      ],
    },
    {
      name: "Black Fen Marshes",
      description:
        "Treacherous wetlands cloaked in fog. Travelers speak of unseen things moving beneath the water.",
      tags: [tags.Hostile],
      exits: ["Dunhollow Crossroads", "Wyrm's Hollow"],
    },
    {
      name: "Wyrm's Hollow",
      description:
        "A deep forest ravine where wolves and worse hunt. Few who enter without cause return.",
      tags: [tags.Hostile],
      exits: ["Black Fen Marshes", "Redbarrow Ruins"],
    },
    {
      name: "Redbarrow Ruins",
      description:
        "Crumbled remains of an ancient fort. Bandits and grave robbers haunt the shadows.",
      tags: [tags.Hostile],
      exits: ["Dunhollow Crossroads", "Wyrm's Hollow", "Ashgrove"],
    },
    {
      name: "Gallows Peak",
      description:
        "A wind-blasted mountain pass with old gallows. Cursed winds howl through the rocks.",
      tags: [tags.Hostile],
      exits: ["Ashgrove"],
    },
    {
      name: "Ashgrove",
      description:
        "Once a thriving hamlet, now a scorched ruin. The scent of burnt wood never fades.",
      tags: [tags.Hostile],
      exits: ["Redbarrow Ruins", "Gallows Peak", "Hollowdeep Caverns"],
    },
    {
      name: "Hollowdeep Caverns",
      description:
        "A dark series of tunnels stretching beneath the hills. Claustrophobic and home to unseen creatures.",
      tags: [tags.Hostile],
      exits: ["Ashgrove", "Bleakstrand Coast"],
    },
    {
      name: "Bleakstrand Coast",
      description:
        "Rocky shores where wrecks lie half-sunken. Sailors claim ghostly lights dance over the waves.",
      tags: [tags.Hostile],
      exits: ["Hollowdeep Caverns"],
    },
  ];

  createLocations(locations);

  const items = [
    {
      name: "Peasant's Hood",
      description: "A simple cloth hood worn by villagers and field hands.",
      tags: [tags.Equipment, tags.Head],
    },
    {
      name: "Peasant's Tunic",
      description: "A coarse linen tunic offering minimal protection.",
      tags: [tags.Equipment, tags.Chest],
    },
    {
      name: "Peasant's Belt",
      description: "A rope belt holding tools and small pouches.",
      tags: [tags.Equipment, tags.Waist],
    },
    {
      name: "Peasant's Gloves",
      description: "Worn cloth gloves with patched fingertips.",
      tags: [tags.Equipment, tags.Hands],
    },
    {
      name: "Peasant's Trousers",
      description: "Basic wool trousers with mud-stained hems.",
      tags: [tags.Equipment, tags.Legs],
    },
    {
      name: "Peasant's Shoes",
      description: "Simple leather shoes with thin soles.",
      tags: [tags.Equipment, tags.Feet],
    },
    {
      name: "Scout's Hood",
      description: "A dark hood worn by woodsmen and rangers.",
      tags: [tags.Equipment, tags.Head],
    },
    {
      name: "Leather Jerkin",
      description: "A reinforced leather chestpiece suited for mobility.",
      tags: [tags.Equipment, tags.Chest],
    },
    {
      name: "Utility Belt",
      description: "A tough belt fitted with loops and satchels.",
      tags: [tags.Equipment, tags.Waist],
    },
    {
      name: "Leather Gloves",
      description: "Sturdy gloves offering grip and protection.",
      tags: [tags.Equipment, tags.Hands],
    },
    {
      name: "Padded Trousers",
      description: "Lightly padded pants to protect against briars and blows.",
      tags: [tags.Equipment, tags.Legs],
    },
    {
      name: "Ranger's Boots",
      description: "Thick leather boots with soft soles for silent movement.",
      tags: [tags.Equipment, tags.Feet],
    },
    {
      name: "Mail Coif",
      description: "A steel-linked hood worn under a helm.",
      tags: [tags.Equipment, tags.Head],
    },
    {
      name: "Chainmail Hauberk",
      description: "A knee-length coat of interlinked metal rings.",
      tags: [tags.Equipment, tags.Chest],
    },
    {
      name: "Warrior's Girdle",
      description: "A reinforced belt supporting the mail and weaponry.",
      tags: [tags.Equipment, tags.Waist],
    },
    {
      name: "Steel Gauntlets",
      description: "Metal-plated gloves worn by infantry and knights.",
      tags: [tags.Equipment, tags.Hands],
    },
    {
      name: "Chain Leggings",
      description: "Flexible chainmail trousers offering solid protection.",
      tags: [tags.Equipment, tags.Legs],
    },
    {
      name: "Iron Sabatons",
      description: "Armored boots with overlapping metal plates.",
      tags: [tags.Equipment, tags.Feet],
    },
    {
      name: "Canvas Satchel",
      description:
        "A worn canvas bag slung over one shoulder. Light and roomy.",
      tags: [tags.Equipment, tags.Back, tags.Storage],
    },
    {
      name: "Leather Backpack",
      description:
        "A rugged backpack with buckles and straps. Useful for carrying gear.",
      tags: [tags.Equipment, tags.Back, tags.Storage],
    },
    {
      name: "Merchant's Sash",
      description:
        "A long cloth sash with hidden pouches sewn into the lining.",
      tags: [tags.Equipment, tags.Waist, tags.Storage],
    },
    {
      name: "Iron Shortsword",
      description: "Reliable, if unremarkable, sidearm for trained fighters.",
      tags: [tags.Weapon],
    },
    {
      name: "Rusty Dagger",
      description:
        "A pitted blade ideal for desperate defense or backalley fights.",
      tags: [tags.Weapon],
    },
    {
      name: "Woodsman's Axe",
      description: "A stout axe used for felling trees—and sometimes foes.",
      tags: [tags.Weapon],
    },
    {
      name: "Claymore",
      description:
        "A massive blade wielded with both hands. Fearsome in open combat.",
      tags: [tags.Weapon],
    },
    {
      name: "Hunter's Bow",
      description: "A longbow of yew, balanced and deadly at range.",
      tags: [tags.Weapon],
    },
    {
      name: "Loaf of Hard Bread",
      description: "Dense, long-lasting bread. Chewing it's half the battle.",
      tags: [tags.Consumable],
    },
    {
      name: "Flask of Red Wine",
      description: "Cheap village wine. Sour but warming.",
      tags: [tags.Consumable],
    },
    {
      name: "Dried Apples",
      description: "Slices of apple, dried over the hearth. Sweet and chewy.",
      tags: [tags.Consumable],
    },
    {
      name: "Bandage Roll",
      description: "Clean cloth strips used to dress wounds. Slows bleeding.",
      tags: [tags.Consumable],
    },
    {
      name: "Tarnished Locket",
      description: "An old silver locket containing a faded portrait.",
      tags: [tags.Trinket],
    },
    {
      name: "Carved Wooden Charm",
      description:
        "A token whittled into the shape of a stag. Thought to bring luck.",
      tags: [tags.Trinket],
    },
    {
      name: "Gold Coin",
      description: "A gold coin. Used as currency.",
      tags: [tags.Currency],
    },
  ];

  await db.itemSpecification.createManyAndReturn({
    data: items.map((item) => ({
      name: item.name,
      description: item.description,
      tags: item.tags,
    })),
  });

  const attributes = [
    {
      name: "Survivalship",
      description: "The ability to survive in the wild.",
      tags: [tags.Skill, tags.Survivalship],
    },
    {
      name: "Combat",
      description: "Combat know-how and technique.",
      tags: [tags.Skill, tags.Combat],
    },
    {
      name: "Crafting",
      description: "The ability to craft items.",
      tags: [tags.Skill, tags.Crafting],
    },
    {
      name: "Foraging",
      description: "The ability to forage for resources.",
      tags: [tags.Skill, tags.Foraging],
    },
    {
      name: "Health",
      description: "Health points.",
      tags: [tags.Resource, tags.Health],
    },
    {
      name: "Stamina",
      description: "Stamina points.",
      tags: [tags.Resource, tags.Stamina],
    },
  ];

  await db.attributeSpecification.createManyAndReturn({
    data: attributes.map((attribute) => ({
      name: attribute.name,
      description: attribute.description,
      tags: attribute.tags,
    })),
  });
}

seed()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
