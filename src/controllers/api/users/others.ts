// import { isEqual, isNil } from "lodash";
// import { userRepository } from "db/dao";
// import checkStatus from "util/sql/checkStatus";
import type { Request, Response } from "express";

// For fetching other accounts
const others = async (_req: Request, _res: Response) => {
  // // Getting the username
  // const { username } = req.params;

  throw new Error("Method not implemented.");

  // try {
  //   // Getting the account
  //   const user = await userRepository.findOne(
  //     {
  //       key: "username",
  //       value: username,
  //     },
  //     [
  //       "id",
  //       "bio",
  //       "cover",
  //       "avatar",
  //       "username",
  //       "last_name",
  //       "first_name",
  //       "created_at",
  //     ]
  //   );

  //   // If the user doesn't exist
  //   if (isNil(user)) return res.sendStatus(404);
  //   else {
  //     // Checking if that user has blocked current user
  //     const status = await checkStatus({
  //       other: user?.id!!,
  //       current: (req?.user as any)?.id!!,
  //     });

  //     // If the other user has blocked current user don't send a response
  //     if (isEqual(status, "BLOCKED")) return res.sendStatus(403);

  //     return res.json(user);
  //   }
  // } catch (error) {
  //   console.error(error);
  //   return res.sendStatus(500);
  // }
};

export default others;
