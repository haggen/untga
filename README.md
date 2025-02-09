# Untga (working title)

> A text-based browser RPG.

⚠️ This is a work in progress.

Untga is a text-based RPG that you can play on your browser.

## Development

The stack is;

1. TypeScript
2. Next.js
3. Tailwind CSS
4. Prisma (SQLite)

### Getting started

```shell
npm install
cp .env.example .env
npx prisma migrate dev
npm start
```

If you change the schema, you need to re-run `npx prisma migrate dev` afterwards.

## Legal

Apache-2.0 ©️ 2024 Arthur Corenzan.
