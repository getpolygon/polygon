import Container from "typedi";
import { PostDaoImpl } from "db/dao/PostDaoImpl";
import { UserDaoImpl } from "db/dao/UserDaoImpl";

export const userDao = Container.get(UserDaoImpl);
export const postDao = Container.get(PostDaoImpl);
