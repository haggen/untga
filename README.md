# Untga (working title)

> A text-based browser RPG.

⚠️ This is a work in progress.

Untga is a text-based RPG that you can play on your browser.

## Development

The stack is;

1. TypeScript
2. Next.js
3. Tailwind CSS
4. Prisma (PostgreSQL)

### Getting started

Copy `compose.override.yml.development-example` as `compose.override.yml` and run:

```shell
docker compose up -w
```

#### IDE integration

```shell
npm install
npx next build # To generate types.
npx prisma generate
```

## Legal

Apache-2.0 ©️ 2024 Arthur Corenzan.
