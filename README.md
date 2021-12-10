# core

> Warning: None of the branches is currently stable. The code is not guaranteed to work. Database schemas are sometimes being updated without creating new migration files. Currently, this is a work-in-progress.

**Core**, powering the new, open-source and privacy-oriented social network - [**Polygon**](https://polygon.am/)

# Development configuration

> Warning: this guide is not created for production purposes. Using this as a way to self-host Polygon is not recommended and may cause errors in the long-term.

These steps will guide you through the process of setting up a [`polygon-isecure/core`](https://github.com/polygon-isecure/core) instance on your machine for development purposes.

For that you will need:

- [Yarn](https://yarnpkg.com/) installed.
- [Node.js](https://nodejs.org/) runtime installed. Version **`14.17.6`** is recommended.
- [Docker](https://www.docker.com/) installed. Will be used for provisioning [Redis](https://redis.io/) and [PostgreSQL](https://www.postgresql.org/) databases.

### Provisioning the databases

Polygon's `core` depends on Redis and PostgreSQL. Let's setup a Redis instance using the following Docker command:

```shell
$ docker run -dp 6379:6379 --name redis redis-cli --requirepass <password>
```

and replace the `<password>` with a secure password. You redis connection URL should now look something like this:

```
redis://default:<password>@localhost:6379/
```

we will need this for later.

Now let's setup PostgreSQL. From the terminal, execute the following command:

```shell
$ docker run -dp 5432:5432 --name polygon-postgres -e POSTGRES_PASSWORD=<password> postgres
```

and replace the `<password>` with a secure password. After doing these steps your PostgreSQL connection URL should look like this:

```
postgres://postgres:<password>@localhost:5432/postgres
```

### Configuring the `core`

Now, after the databases have been provisioned, we will need to configure the `core` itself. For now create a `config.yaml` in root directory and add the following properties to it:

```yaml
# JWT configuration
jwt:
  secret: "<something super random>"
  refresh: "<something super random>"

# Polygon configuration
# polygon:
# Only needed if email verification is enabled
# frontend_url: "http://localhost:3000"

# Database configuration
databases:
  redis: "redis://default:<password>@localhost:6379/"
  postgres: "postgres://postgres:<password>@localhost:5432/postgres"
```

Replace `<something super random>` with a random. We recommend a string value with a length of at least `512` bits(64 characters).

#### Running migrations

We will need to sync the migrations with the database. To do that run the following command:

```shell
$ yarn migrate postgres "user=postgres password=<password> sslmode=disable dbname=postgres" up
```

and replace `<password>` with the password that you defined earlier for PostgreSQL. This will ensure that the SQL models are up-to-date.

#### Building the project

Now it is time to install the dependencies and transpile the project and run it:

```shell
$ yarn install
$ yarn build
$ yarn start
```

By default, the server will start at the `http://localhost:3001/` address. To set a custom port, you can either set the `POLYGON_PORT` or `PORT` environment variables to your desired number(ranging from `0-65535`).

Congratulations 🎊 You should now have a complete version of `polygon-isecure/core` running. To sync with the nightly branch just run the following commands:

```shell
$ git fetch
$ git pull origin nightly
```

<small>Again, this guide is not intended for production purposes. Current version of `core` is unstable and has some problems that we still have to deal with.</small>
