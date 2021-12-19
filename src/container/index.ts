import Container from "typedi";
import { Logger } from "util/logger";
import { PostDaoImpl } from "dao/PostDaoImpl";
import { UserDaoImpl } from "dao/UserDaoImpl";
import { UpvoteDaoImpl } from "dao/UpvoteDaoImpl";
import { RelationDaoImpl } from "dao/RelationDaoImpl";

export const logger = Container.get(Logger);
export const userDao = Container.get(UserDaoImpl);
export const postDao = Container.get(PostDaoImpl);
export const upvoteDao = Container.get(UpvoteDaoImpl);
export const relationDao = Container.get(RelationDaoImpl);
