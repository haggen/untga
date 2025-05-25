# Untitled Game

> _Untga_ is a text-based browser MMORPG that borrows ideas from [incremental games](https://en.wikipedia.org/wiki/Incremental_game) and [MMORPGs](https://en.wikipedia.org/wiki/Massively_multiplayer_online_role-playing_game).

The project is under open development and isn't playable just yet. In the meantime, you can read and comment on:

- 🏰 [Gameplay design draft](https://github.com/haggen/untga/discussions/21)
- ⚡️ [Influences and prior art](https://github.com/haggen/untga/discussions/22)

## Development

### Getting started

You'll need:

1. Node.js v23+.
2. Docker Compose v2+.
3. Traefik v3+ connected to a Docker network named `traefik`. More on https://github.com/corenzan/traefik.

Copy `compose.override.yml.development-example` to `compose.override.yml` and `.env.example` to `.env`, then run:

```shell
docker compose up --watch
```

We use [Docker Compose's watch mode](https://docs.docker.com/compose/how-tos/file-watch/) to automatically copy files changed on the host into the container.

Launch https://untga.local.crz.li.

### IDE integration

The container will isolate the `node_modules` directory, therefore dependencies and generated code, such as Next.js' types and Prisma's client, won't be locally available unless you fix it:

```shell
npm ci
npx prisma generate
npx next build
```

## Deployment

You'll need:

1. Docker Compose v2+.
2. Traefik v3+ connected to a network named `traefik`.

Copy `compose.override.yml.production-example` to `compose.override.yml`, edit it according to your needs, then run:

```shell
docker compose up --detach
```

## Legal

Apache-2.0 ©️ 2024 Arthur Corenzan and Untga contributors.
