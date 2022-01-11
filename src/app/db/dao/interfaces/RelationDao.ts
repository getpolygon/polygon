import type { Status } from "../entities/Relation";

export interface RelationDao {
  /**
   * For checking the relation status between two users by their IDs
   *
   * @param first - First user ID
   * @param second - Second user ID
   */
  getRelationByUserIds(first: string, second: string): Promise<Status>;

  /**
   * For checking the relation status between two users by their usernames.
   * Finds both users by their usernames and gets their ids.
   *
   * Works by executing `getRelationByUserIds` under the hood.
   *
   * @param first - First user's username
   * @param second - Second user's username
   */
  getRelationByUsernames(first: string, second: string): Promise<Status>;
}
