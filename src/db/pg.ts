import { Pool } from "pg";
import { isNil } from "lodash";
import { Service } from "typedi";
import config from "config/index";
import { postgres } from "config/env";
import { IDatabase } from "./common/IDatabase";
import { PartialConfigError } from "lib/PartialConfigError";
import { IDatabaseResult } from "./common/IDatabaseResult";

const connectionString = postgres || config.databases?.postgres;
if (isNil(connectionString))
  throw new PartialConfigError("`database.postgres`");

/**
 * PostgreSQL database implementation
 */
@Service()
export class Postgres implements IDatabase {
  private readonly pg: Pool;

  constructor() {
    this.pg = new Pool({ connectionString });
    // Connecting to the database
    this.connect().catch(console.error);
  }

  // prettier-ignore
  public async query(statement: string, args?: any[]): Promise<IDatabaseResult> {
    const result = await this.pg.query(statement, args);
    return result;
  }

  public async connect(): Promise<void> {
    await this.pg.connect();
  }
}

// Raw Postgres connection for execution of queries that cannot be made through DAOs
export default new Postgres();
