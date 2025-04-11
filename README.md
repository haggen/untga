# Untga (working title)

> A text-based browser multiplayer RPG.

Untga is a text-based multiplayer RPG that borrows ideas from [incremental games](https://en.wikipedia.org/wiki/Incremental_game) and [MMORPGs](https://en.wikipedia.org/wiki/Massively_multiplayer_online_role-playing_game).

## Roadmap

The project is still early in development and things can change fast.

### Current milestone

- [x] Registration.
- [x] Login.
- [ ] Recovery (forgot password).
- [ ] E-mail verification.
- [ ] Session invalidation.
- [x] Character creation.
- [x] Character editing.
- [x] Basic data structures for game mechanics.
- [ ] Character deletion.
- [ ] Change your e-mail.
- [ ] Change your password.
- [ ] Account deletion.
- [ ] Instantaneous travel between locations.
- [ ] Change equipment (equip and unequip).
- [ ] Player journal.

### Future milestones

- [ ] Combat simulation during travels to hostile places.
- [ ] Foraging and gathering resources.
- [ ] Crafting.
- [ ] Travel length based on location distance.
- [ ] NPC dialogue and quests.
- [ ] Social interactions (mail, friendship, trade, etc).

## Development

### Getting started

Copy `compose.override.yml.development-example` as `compose.override.yml` and run:

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

### Guidelines

These are some of the guidelines thought of during the development and in no particular order.

#### Route handlers

When working on route handlers, please make sure:

1. Middlewares, like error handling, are being used.
2. Inputs like querystring and payload are being validated.
3. Thrown errors are meaningful and are not masking the underlying issue.
4. Read and write access are being properly checked.
5. Collection's response returns a total amount.

## Legal

Apache-2.0 ©️ 2024 Arthur Corenzan, and Untga contributors.
