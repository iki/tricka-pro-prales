# Development seeds

Export the SQL seeds into [`default`](./default).

Optionally, put seed reset SQL to [`default/.reset.sql`](./default/.reset.sql).

The migrations [won't](./.gitignore) be committed to the repository, except the seed reset.

## Seeding with migration

Create and apply a seed migration:

```sh
npm run migrate:seed
```

Or apply in a separate step:

```sh
npm run migrate:seed:add
npm run migrate  # runs: hasura --database-name default migrate apply
```

## Reseeding with migration

Update and apply a seed migration:

```sh
npm run migrate:reseed
```

Or apply in a separate step:

```sh
npm run migrate:seed:add  # updates seed migration if present
npm run migrate:redo  # migrate:down & migrate:up
```

## Seeding manually

Apply all seeds:

```sh
npm run seed  # runs: hasura --database-name default seed apply
```
