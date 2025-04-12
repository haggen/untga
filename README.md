# Untga (working title)

> A text-based multiplayer RPG that you can play idly on your browser.

Untga is a text-based multiplayer RPG that borrows ideas from [incremental games](https://en.wikipedia.org/wiki/Incremental_game) and [MMORPGs](https://en.wikipedia.org/wiki/Massively_multiplayer_online_role-playing_game).

Read and comment on the basic design of the game: https://github.com/haggen/untga/discussions/21

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
