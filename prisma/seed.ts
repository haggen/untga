import { randomUUID } from "crypto";
import { DateTime } from "luxon";
import { db } from "~/lib/db";
import { tag } from "~/lib/tags";

// const args = process.argv.slice(2);

const seed = {
  locations: [
    {
      name: "Duskhollow",
      description:
        "A remote village where hunters live in harmony with the surrounding woods. The scent of smoke and venison lingers in the air.",
      tags: [tag.Peaceful, tag.Starting],
      area: 2,
      security: 85,
    },
    {
      name: "Mossveil Clearing",
      description:
        "A serene opening in the dense woods, often used as a resting ground by travelers and foraging beasts alike.",
      tags: [tag.Peaceful],
      area: 1,
      security: 70,
    },
    {
      name: "Elderstone Ruins",
      description:
        "Crumbling remnants of an old keep, now overrun by wild brush and creatures that thrive in shadow.",
      tags: [tag.Hostile],
      area: 3,
      security: 15,
    },
    {
      name: "Whispermeadow",
      description:
        "A wind-swept field where wildflowers bloom year-round. Locals say the wind carries voices, but none have proven it.",
      tags: [tag.Peaceful],
      area: 2,
      security: 75,
    },
    {
      name: "Hollow Pines",
      description:
        "A sprawling woodland with old pines and narrow game trails. The trees creak eerily in the wind.",
      tags: [tag.Route],
      area: 4,
      security: 40,
      destinations: [
        "Duskhollow",
        "Mossveil Clearing",
        "Elderstone Ruins",
        "Whispermeadow",
      ],
    },
    {
      name: "Fangmaw Cavern",
      description:
        "A jagged cave filled with bat colonies and the bones of past explorers. Enter only with torch and blade.",
      tags: [tag.Hostile],
      area: 3,
      security: 25,
    },
    {
      name: "Oldroot Grotto",
      description:
        "A damp and winding cave, overgrown with pale fungi. Strange blind creatures make their nests here.",
      tags: [tag.Hostile],
      area: 2,
      security: 20,
    },
    {
      name: "Grayhorn Pass",
      description:
        "A steep and narrow trail carved through the mountains. Snow falls even in summer.",
      tags: [tag.Hostile],
      area: 4,
      security: 10,
    },
    {
      name: "Stoneford",
      description:
        "A riverside village of stoic miners and shepherds. Life is simple, though not without danger.",
      tags: [tag.Peaceful],
      area: 2,
      security: 65,
    },
    {
      name: "The Vale of Echoes",
      description:
        "A misty valley where sound travels in odd ways. Shepherds warn folk wolves roam here at dusk.",
      tags: [tag.Route],
      area: 4,
      security: 35,
      destinations: [
        "Fangmaw Cavern",
        "Oldroot Grotto",
        "Whispermeadow",
        "Grayhorn Pass",
        "Stoneford",
      ],
    },
    {
      name: "Ashveil Hollow",
      description:
        "A scorched cave with sulfur vents and crumbling rock. Miners abandoned it after a series of collapses.",
      tags: [tag.Hostile],
      area: 3,
      security: 10,
    },
    {
      name: "Frosttongue Crag",
      description:
        "A frozen cave with strange carvings and perpetual frost. Its origins remain a mystery.",
      tags: [tag.Hostile],
      area: 2,
      security: 20,
    },
    {
      name: "Highwatch",
      description:
        "A remote peak used by sentinels to scout the valleys below. Rarely visited now.",
      tags: [tag.Peaceful],
      area: 3,
      security: 80,
    },
    {
      name: "The Cloudbridge",
      description:
        "A narrow stone bridge spanning two cliffs. Traders once crossed here before the storms returned.",
      tags: [tag.Route],
      area: 3,
      security: 30,
      destinations: [
        "Stoneford",
        "Ashveil Hollow",
        "Frosttongue Crag",
        "Highwatch",
      ],
    },
    {
      name: "Thistlebrush",
      description:
        "A sparse woodland scattered with thorns and low brush. Often used by smugglers and foxes alike.",
      tags: [tag.Hostile],
      area: 2,
      security: 35,
    },
    {
      name: "Hillmere",
      description:
        "A lively town at the foot of the plains, known for its bustling markets and well-defended walls.",
      tags: [tag.Peaceful],
      area: 3,
      security: 90,
    },
    {
      name: "Timberfell Camp",
      description:
        "A rough logging encampment where axes sing and ale flows. Bandit raids are an unfortunate norm.",
      tags: [tag.Hostile],
      area: 2,
      security: 30,
    },
    {
      name: "Sunstain Ruins",
      description:
        "An overgrown temple ruin. Feral dogs and scavengers roam its sunken halls.",
      tags: [tag.Hostile],
      area: 3,
      security: 25,
    },
    {
      name: "Willowfen",
      description:
        "A peaceful village surrounded by willow groves and still ponds. The frogs here sing sweetly at night.",
      tags: [tag.Peaceful],
      area: 2,
      security: 80,
    },
    {
      name: "The Golden Plain",
      description:
        "A vast stretch of rolling grasslands dotted with stones and secrets from a forgotten age.",
      tags: [tag.Route],
      area: 5,
      security: 45,
      destinations: [
        "Grayhorn Pass",
        "Thistlebrush",
        "Hillmere",
        "Timberfell Camp",
        "Sunstain Ruins",
        "Willowfen",
      ],
    },
    {
      name: "Cragwatch Keep",
      description:
        "A crumbling fortress perched on the edge of a cliff. Once a seat of power, now home to outlaws and vermin.",
      tags: [tag.Hostile],
      area: 4,
      security: 10,
    },
    {
      name: "Blackmire",
      description:
        "A boggy mire filled with biting insects and treacherous footing. Stories of disappearances are common.",
      tags: [tag.Hostile],
      area: 4,
      security: 5,
    },
    {
      name: "Forgotten Trial",
      description:
        "A rarely used path that weaves through the wildlands. Only those desperate or mad tread here.",
      tags: [tag.Route],
      area: 5,
      security: 15,
      destinations: ["Cragwatch Keep", "Blackmire", "Sunstain Ruins"],
    },
  ],

  items: [
    {
      name: "Peasant's Hood",
      description: "A simple cloth hood worn by villagers and field hands.",
      tags: [tag.Equipment, tag.Head, tag.Craftable, tag.Breakable],
    },
    {
      name: "Peasant's Tunic",
      description: "A coarse linen tunic offering minimal protection.",
      tags: [
        tag.Equipment,
        tag.Torso,
        tag.Starting,
        tag.Craftable,
        tag.Breakable,
      ],
    },
    {
      name: "Peasant's Belt",
      description: "A rope belt holding tools and small pouches.",
      tags: [tag.Equipment, tag.Waist, tag.Craftable, tag.Breakable],
    },
    {
      name: "Peasant's Gloves",
      description: "Worn cloth gloves with patched fingertips.",
      tags: [tag.Equipment, tag.Hands, tag.Craftable, tag.Breakable],
    },
    {
      name: "Peasant's Trousers",
      description: "Basic wool trousers with mud-stained hems.",
      tags: [
        tag.Equipment,
        tag.Legs,
        tag.Starting,
        tag.Craftable,
        tag.Breakable,
      ],
    },
    {
      name: "Peasant's Shoes",
      description: "Simple leather shoes with thin soles.",
      tags: [
        tag.Equipment,
        tag.Feet,
        tag.Starting,
        tag.Craftable,
        tag.Breakable,
      ],
    },
    {
      name: "Scout's Hood",
      description: "A dark hood worn by woodsmen and rangers.",
      tags: [tag.Equipment, tag.Head, tag.Craftable, tag.Breakable],
    },
    {
      name: "Leather Jerkin",
      description: "A reinforced leather chestpiece suited for mobility.",
      tags: [tag.Equipment, tag.Torso, tag.Craftable, tag.Breakable],
    },
    {
      name: "Utility Belt",
      description: "A tough belt fitted with loops and satchels.",
      tags: [tag.Equipment, tag.Waist, tag.Craftable, tag.Breakable],
    },
    {
      name: "Leather Gloves",
      description: "Sturdy gloves offering grip and protection.",
      tags: [tag.Equipment, tag.Hands, tag.Craftable, tag.Breakable],
    },
    {
      name: "Padded Trousers",
      description: "Lightly padded pants to protect against briars and blows.",
      tags: [tag.Equipment, tag.Legs, tag.Craftable, tag.Breakable],
    },
    {
      name: "Ranger's Boots",
      description: "Thick leather boots with soft soles for silent movement.",
      tags: [tag.Equipment, tag.Feet, tag.Craftable, tag.Breakable],
    },
    {
      name: "Mail Coif",
      description: "A steel-linked hood worn under a helm.",
      tags: [tag.Equipment, tag.Head, tag.Craftable, tag.Breakable],
    },
    {
      name: "Chainmail Hauberk",
      description: "A knee-length coat of interlinked metal rings.",
      tags: [tag.Equipment, tag.Torso, tag.Craftable, tag.Breakable],
    },
    {
      name: "Warrior's Girdle",
      description: "A reinforced belt supporting the mail and weaponry.",
      tags: [tag.Equipment, tag.Waist, tag.Craftable, tag.Breakable],
    },
    {
      name: "Steel Gauntlets",
      description: "Metal-plated gloves worn by infantry and knights.",
      tags: [tag.Equipment, tag.Hands, tag.Craftable, tag.Breakable],
    },
    {
      name: "Chain Leggings",
      description: "Flexible chainmail trousers offering solid protection.",
      tags: [tag.Equipment, tag.Legs, tag.Craftable, tag.Breakable],
    },
    {
      name: "Iron Sabatons",
      description: "Armored boots with overlapping metal plates.",
      tags: [tag.Equipment, tag.Feet, tag.Craftable, tag.Breakable],
    },
    {
      name: "Canvas Satchel",
      description:
        "A worn canvas bag slung over one shoulder. Light and roomy.",
      tags: [
        tag.Equipment,
        tag.Pack,
        tag.Storage,
        tag.Starting,
        tag.Craftable,
        tag.Breakable,
      ],
    },
    {
      name: "Leather Backpack",
      description:
        "A rugged backpack with buckles and straps. Useful for carrying gear.",
      tags: [
        tag.Equipment,
        tag.Pack,
        tag.Storage,
        tag.Craftable,
        tag.Breakable,
      ],
    },
    {
      name: "Merchant's Sash",
      description:
        "A long cloth sash with hidden pouches sewn into the lining.",
      tags: [
        tag.Equipment,
        tag.Waist,
        tag.Storage,
        tag.Craftable,
        tag.Breakable,
      ],
    },
    {
      name: "Iron Shortsword",
      description: "Reliable, if unremarkable, sidearm for trained fighters.",
      tags: [tag.Weapon, tag.Craftable, tag.Breakable],
    },
    {
      name: "Rusty Dagger",
      description:
        "A pitted blade ideal for desperate defense or backalley fights.",
      tags: [tag.Weapon, tag.Starting, tag.Craftable, tag.Breakable],
    },
    {
      name: "Woodsman's Axe",
      description: "A stout axe used for felling trees—and sometimes foes.",
      tags: [tag.Weapon, tag.Craftable, tag.Breakable],
    },
    {
      name: "Claymore",
      description:
        "A massive blade wielded with both hands. Fearsome in open combat.",
      tags: [tag.Weapon, tag.Craftable, tag.Breakable],
    },
    {
      name: "Hunter's Bow",
      description: "A longbow of yew, balanced and deadly at range.",
      tags: [tag.Weapon, tag.Craftable, tag.Breakable],
    },
    {
      name: "Loaf of Hard Bread",
      description: "Dense, long-lasting bread. Chewing it's half the battle.",
      tags: [tag.Consumable, tag.Food, tag.Starting],
    },
    {
      name: "Flask of Red Wine",
      description: "Cheap village wine. Sour but warming.",
      tags: [tag.Consumable, tag.Drink, tag.Starting],
    },
    {
      name: "Dried Apples",
      description: "Slices of apple, dried over the hearth. Sweet and chewy.",
      tags: [tag.Consumable, tag.Food],
    },
    {
      name: "Bandage Roll",
      description: "Clean cloth strips used to dress wounds. Slows bleeding.",
      tags: [tag.Consumable, tag.Stackable, tag.Healing],
    },
    {
      name: "Tarnished Locket",
      description: "An old silver locket containing a faded portrait.",
      tags: [tag.Trinket],
    },
    {
      name: "Carved Wooden Charm",
      description:
        "A token whittled into the shape of a stag. Thought to bring luck.",
      tags: [tag.Trinket],
    },
    {
      name: "Gold Coin",
      description: "A gold coin. Used as currency.",
      tags: [tag.Currency, tag.Stackable, tag.Starting],
    },
    {
      name: "Bedroll",
      description: "A rolled bundle of blankets for sleeping outdoors.",
      tags: [tag.Utility, tag.Starting, tag.Resting],
    },
  ],
  attributes: [
    {
      name: "Navigation",
      description:
        "By star, map, or uncanny instinct, you discern the swiftest routes. Worn paths and forgotten shortcuts yield passage, hastening your journeys across the realm and ensuring you don't stray needlessly from the path.",
      tags: [tag.Skill, tag.Starting, tag.Navigation],
    },
    {
      name: "Perception",
      description:
        "Few details escape your keen senses. Spot the glint of lost trinkets, the tremor of unsafe ground, or the silent threat of ambush ahead. Heightened awareness keeps you safer from hazards and may reveal unexpected opportunities.",
      tags: [tag.Skill, tag.Starting, tag.Perception],
    },
    {
      name: "Endurance",
      description:
        "Miles melt away beneath tireless feet. A hardy constitution shrugs off the road's exhaustion, conserving your vital energy and letting you journey farther before rest is needed. You push onward where lesser folk would falter.",
      tags: [tag.Skill, tag.Starting, tag.Endurance],
    },
    {
      name: "Combat",
      description:
        "In the heat of battle, you remain calm and collected. Your training and instincts guide your strikes, parries, and dodges. You know when to press the attack and when to retreat. Your skill with weapons makes you a formidable opponent.",
      tags: [tag.Skill, tag.Starting, tag.Combat],
    },
    {
      name: "Health",
      description: "Health points.",
      tags: [tag.Resource, tag.Starting, tag.Health],
    },
    {
      name: "Stamina",
      description: "Stamina points.",
      tags: [tag.Resource, tag.Starting, tag.Stamina],
    },
  ],
};

async function main() {
  const sample = await db.itemSpecification.findFirst();

  if (sample) {
    console.log("Database is already seeded. Skipping.");
    return;
  }

  await db.$transaction(async (tx) => {
    await tx.location.createManyAndReturn({
      data: seed.locations.map((location) => ({
        name: location.name,
        description: location.description,
        tags: location.tags,
        area: location.area,
        security: location.security,
      })),
    });

    seed.locations.forEach(async (data) => {
      if (!data.destinations) {
        return;
      }

      await tx.location.update({
        where: { name: data.name },
        data: {
          destinations: {
            connect: data.destinations.map((name) => ({ name })),
          },
        },
      });
    });

    await tx.itemSpecification.createManyAndReturn({
      data: seed.items.map((item) => ({
        name: item.name,
        description: item.description,
        tags: item.tags,
      })),
    });

    await tx.attributeSpecification.createManyAndReturn({
      data: seed.attributes.map((attribute) => ({
        name: attribute.name,
        description: attribute.description,
        tags: attribute.tags,
      })),
    });
  });

  const system = await db.user.create({
    data: {
      email: "system@localhost",
      password: randomUUID(),
    },
  });

  const session = await db.session.create({
    data: {
      user: { connect: { id: system.id } },
      expiresAt: DateTime.now().plus({ year: 10 }).toJSDate(),
      ip: "127.0.0.1",
      userAgent: "n/a",
    },
  });

  console.log("System session secret:", session.secret);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
