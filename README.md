# Untga (working title)

> Untga is a text-based browser MMORPG that borrows ideas from [incremental games](https://en.wikipedia.org/wiki/Incremental_game) and [classic MMORPGs](https://en.wikipedia.org/wiki/Massively_multiplayer_online_role-playing_game).

The project is still under development but take a look at what you can expect.

- 📜 Text-based MMORPG you can play on desktop, tablet, or phone.
- 💪 No levels — improve skills by using them.
- 🗺️ Explore a vast low-fantasy world, but be prepared.
- ⚔️ Face dangers as you seek treasure, resources, and lore.
- 🛠️ Be what you want: a gatherer, crafter, trader, adventurer, bandit — or anything in between.
- 🤝 Strengthen your social skills through trading, PvP, and teaming up.
- ✨ Discover hidden stories scattered across the world and embark on quests.

[Read and comment on the design of the core gameplay](https://github.com/haggen/untga/discussions/21)

## Development

### Getting started

Copy `compose.override.yml.development-example` as `compose.override.yml` and `.env.example` as `.env` and run:

```shell
docker compose up -w
```

### IDE integration

The container will isolate the `node_modules` directory, therefore dependencies and generated code, such as Next.js' types and Prisma's client, won't be locally available unless you fix it:

```shell
npm ci
npx prisma generate
npx next build
```

## Legal

Apache-2.0 ©️ 2024 Arthur Corenzan, and Untga contributors.
