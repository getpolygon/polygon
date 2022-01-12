# core

![Node CI](https://github.com/polygon-isecure/core/actions/workflows/node.yml/badge.svg)
![Docker](https://github.com/polygon-isecure/core/actions/workflows/docker-publish.yml/badge.svg)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fpolygon-isecure%2Fcore.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Fpolygon-isecure%2Fcore?ref=badge_small)

> Warning: None of the branches is currently stable. The code is not guaranteed to work. Database schemas are sometimes being updated without creating new migration files. Currently, this is a work-in-progress.

The core powering [Polygon](https://polygon.am/): an upcoming open-source & privacy-oriented social network that is not hungry for your data.

## Development configuration

> Warning: this guide is not created for production purposes. Using this as a way to self-host Polygon is not recommended and may cause errors in the long-term.

These steps will guide you through the process of setting up a [`polygon-isecure/core`](https://github.com/polygon-isecure/core) instance on your machine for development purposes.

For that you will need:

- [Yarn](https://yarnpkg.com/) installed.
- [Node.js](https://nodejs.org/) runtime installed. Version **`14.17.6`** is recommended.
- [Docker](https://www.docker.com/) installed. Will be used for provisioning [Redis](https://redis.io/),
  [Stormi](https://github.com/polygon-isecure/stormi) and [PostgreSQL](https://www.postgresql.org/) databases.

### Provisioning the databases

Polygon's `core` depends on Redis and PostgreSQL. Let's setup a Redis instance using the following Docker command:

```bash
docker run --name redis -dp 6379:6379 redis redis-server --requirepass "<password>"
```

and replace the `<password>` with a secure password. You redis connection URL should now look something like this:

```txt
redis://default:<password>@localhost:6379/
```

Now let's setup PostgreSQL. From the terminal, execute the following command:

```bash
docker run --name postgres -dp 5432:5432 -e POSTGRES_PASSWORD=<password> postgres
```

and replace the `<password>` with a secure password. After doing these steps your PostgreSQL connection URL should look like this:

```txt
postgres://postgres:<password>@localhost:5432/postgres
```

Finally, let's configure Stormi, which is a simple, hash-based
and open-source file server.

```bash
docker run --name stormi -dp 6345:6345 ghcr.io/polygon-isecure/stormi:master
```

By default, the username and password are `admin`
and `stormi-admin`.

Stormi connection string has the following structure:

```txt
https://admin:stormi-admin@localhost:6345/
```

### Configuring the `core`

Now, after the databases have been provisioned, we will need to configure the `core` itself. For now create a `config.yaml` in root directory and add the following properties to it:

```yaml
session:
  secret: "<something super random>"

jwt:
  secret: "<something super random>"
  refresh: "<something super random>"

databases:
  redis: "redis://default:<password>@localhost:6379/"
  stormi: "https://admin:stormi-admin@localhost:6345/"
  postgres: "postgres://postgres:<password>@localhost:5432/postgres"
```

Replace `<something super random>` with a random string. We recommend a
string value with a length of at least `512` bits(64 characters).

#### Running migrations

To sync the migrations with the database, run the following
command:

```bash
yarn migrate "user=postgres password=<password> sslmode=disable dbname=postgres" up
```

and replace `<password>` with the password that you defined
earlier for PostgreSQL. This will ensure that everything
related to SQL is up-to-date.

#### Building the project

Now it is time to install the dependencies, transpile the project and run it:

```shell
yarn install
yarn build
yarn start
```

By default, the server will start at `http://localhost:3001/`. To set a
custom port, you can specify the `polygon.port` variable in your configuration
file:

```yaml
polygon:
  port: 5000
  # ...
```

Congratulations 🎊 You should now have a complete version of `polygon-isecure/core` running. To sync with the nightly branch just run the following commands:

```shell
git fetch
git pull origin nightly
```

> Again, this guide is not intended for production purposes. Current version of `core` is unstable and has some problems that we still have to deal with.
