import { Pool } from "pg";
import config from "config";
import { Logger } from "util/logger";
import Container, { Service } from "typedi";
import type { IDatabase } from "./common/IDatabase";
import type { IDatabaseResult } from "./common/IDatabaseResult";

/**
 * PostgreSQL database implementation
 */
@Service()
export class Postgres implements IDatabase {
  private readonly pg: Pool;

  constructor(private readonly logger: Logger) {
    this.pg = new Pool({
      connectionTimeoutMillis: 1000 * 60,
      connectionString: config.databases.postgres,
    });
    // Connecting to the database
    this.connect();
  }

  public async getFirst<T>(query: string, args?: unknown[]): Promise<T> {
    const result = await this.pg.query(query, args);
    return result.rows[0];
  }

  public async query(
    statement: string,
    args?: unknown[]
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
