## Polygon SQL standards

Polygon mostly uses camel case(e.g. `first_name` not `firstName`) in SQL.

Migrations of indexes, views etc. should be created in separate files, to make debugging easier.

Our main migration tool is [goose](https://github.com/pressly/goose) located in the `bin/` folder. We include both Linux and Windows executables.

Migrations should be SQL files (ending in `.sql`). To create a new migration file from goose run

```shell
$ yarn migrate "user= password= sslmode=disable" create table_name sql
```

> You may optionally want to specify the `GOOSE_DBSTRING` environment variable to connect to the database automatically using `goose`.

Where `user` is the database user(default: `postgres`) and `password` is the password of the selected user. In the `migrations/` folder you should have a new file named something like `12345_table_name.sql` with the following content:

```sql
-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
```

Place the `up` migration after `--+goose Up -- +goose StatementBegin` and the `down` migration after `-- +goose Down -- +goose StatementBegin`.

Example:

```sql
-- +goose NO TRANSACTION
-- +goose Up
-- +goose StatementBegin
CREATE UNIQUE INDEX CONCURRENTLY users_id_pkey ON users(id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX CONCURRENTLY users_id_pkey;
-- +goose StatementEnd
```

### Tables

When creating tables, follow these requirements:

- Make sure that the table uses camel case naming

- Create table names which have a maximum name length of `24` characters
- Use `TEXT` instead of `VARCHAR` for storing columns which may potentially be lengthy

- Always include a `created_at` field in your tables. Make sure they are `TIMESTAMPTZ NOT NULL DEFAULT NOW()`.

- Always use `UUID`s as default values for `PRIMARY KEY`s. **Do not use** `BIGSERIAL` or `BIGINT` types/values in any case

- Do not an arbitrary length limit to `VARCHAR` columns unless necessary and make sure to add correct indexes (e.g. `VARCHAR(n)`, use `VARCHAR` instead)

