import { Pool } from "pg";
import { isNil } from "lodash";
import config from "config/index";
import { postgres } from "config/env";
import type { Logger } from "util/logger";
import Container, { Service } from "typedi";
import { IDatabase } from "./common/IDatabase";
import { IDatabaseResult } from "./common/IDatabaseResult";
import { PartialConfigError } from "lib/PartialConfigError";

const connectionString = postgres || config.databases?.postgres;
if (isNil(connectionString))
  throw new PartialConfigError("`database.postgres`");

/**
 * PostgreSQL database implementation
 */
@Service()
export class Postgres implements IDatabase {
  private readonly pg: Pool;

  constructor(private readonly logger: Logger) {
    this.pg = new Pool({ connectionString });

    // Connecting to the database
    this.connect();
  }

  public async query(
    statement: string,
    args?: any[]
  ): Promise<IDatabaseResult> {
    const result = await this.pg.query(statement, args);
    return result;
  }

  public async connect(): Promise<void> {
    try {
      await this.pg.connect();
      this.logger.info("Connection to PostgreSQL established successfully");
    } catch (e) {
      this.logger.error("There was an error while connecting to PostgreSQL");
      throw e;
    }
  }
}

// Raw Postgres connection for execution of queries that cannot be made through DAOs
export default Container.get(Postgres);
