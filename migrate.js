require("dotenv").config();
const { DATABASE_URL } = process.env;
const { createPool } = require("slonik");
const { SlonikMigrator } = require("@slonik/migrator");

const slonik = createPool(DATABASE_URL);
const migrator = new SlonikMigrator({
  slonik,
  migrationsPath: "migrations",
  migrationTableName: "migrations",
});

migrator.runAsCLI();
