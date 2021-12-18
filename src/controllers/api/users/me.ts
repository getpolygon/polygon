// import { userRepository } from "db/dao";
import type { Request, Response } from "express";

// For fetching current account details
const me = async (_req: Request, _res: Response) => {
  // try {
  //   // Getting the account
  //   // prettier-ignore
  //   const user = await userRepository.findOne(
  //     { key: "id", value: req.user?.id },
  //     ["id", "bio", "cover", "avatar", "username", "last_name", "first_name", "created_at"]
  //   );
  //   return res.json(user);
  // } catch (error) {
  //   console.error(error);
  //   return res.sendStatus(500);
  // }
};

export default me;
