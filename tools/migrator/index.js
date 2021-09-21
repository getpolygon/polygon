const path = require("path");
const { createPool } = require("slonik");
const { SlonikMigrator } = require("@slonik/migrator");

require("dotenv").config({ path: path.resolve(".env") });
const { DATABASE_URL } = process.env;

const slonik = createPool(DATABASE_URL);
const migrator = new SlonikMigrator({
  slonik,
  migrationsPath: "migrations",
  migrationTableName: "migrations",
});

migrator.runAsCLI();
