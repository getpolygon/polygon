require("dotenv").config();

const { createPool } = require("slonik");
const { SlonikMigrator } = require("@slonik/migrator");

const { DATABASE_URL } = process.env;

const slonik = createPool(DATABASE_URL);
const migrator = new SlonikMigrator({
  slonik,
  migrationsPath: "migrations",
  migrationTableName: "migrations",
});

migrator.runAsCLI();
