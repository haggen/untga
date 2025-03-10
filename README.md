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

The container will isolate its `node_modules` directory, therefore dependencies as well as Next.js and Prisma generated code won't be immediately locally available. To fix this, stop the container and run;

```shell
npm install
npx next build
npx prisma generate
```

#### Guidelines

Below are some guidelines thought of during the development and in no particular order.

##### Route handlers

When working on route handlers, please make sure;

1. You're using the error handler middleware.
2. You have input validation near the top.
3. You don't end up masking errors.
4. You check the requester's access.
5. Collection's response has a total count.

## Legal

Apache-2.0 ©️ 2024 Arthur Corenzan.
