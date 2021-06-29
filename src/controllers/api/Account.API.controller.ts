import Express from "express";
import minio from "../../db/minio";
import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();
const textCleaner = require("../../helpers/textCleaner");

const AccountController = {
  // For fetching account details
  fetchAccount: async (req: Express.Request, res: Express.Response) => {
    const { accountId } = req.query;

    // If no account ID was provided
    if (!accountId) return res.json(req.user!!);
    else {
      // Finding the account and omitting `password`, `email`, `notifications`, `friends` fields
      const user = await prisma.user.findUnique({
        where: {
          id: accountId.toString(),
        },
        select: {
          id: true,
          bio: true,
          roles: true,
          avatar: true,
          username: true,
          lastName: true,
          firstName: true,
          privateAccount: true,
        },
      });

      // If the account does not exist
      if (!user) return res.status(404).send();
      else return res.json(user);
    }
  },
  // For deleting account
  deleteAccount: async () => {
    // // Getting the ID of the user
    // const { id } = req.user;
    // // Getting all posts
    // const posts = await PostSchema.find({ author: id });
    // // Deleteing the account from MongoDB
    // const result = await AccountSchema.findByIdAndDelete(id);
    // // Deleting the posts that are associated with this account
    // // const postResult = await PostSchema.deleteMany({ author: id });
    // // Clearing the cookie and sending the response
    // return res.status(200).clearCookie("jwt").send();
  },

  updateAccount: async (req: Express.Request, res: Express.Response) => {
    // Getting the user
    const { user } = req;
    // Creating an updated variable to store modified data
    let updated: User | null = null;
    // Getting the payload
    const { bio, theme, avatar } = req.body;

    // If theme was provided
    if (theme) {
      // If dark theme was selected
      if (theme?.dark && !theme?.light) {
        updated = await prisma.user.update({
          where: {
            id: user?.id,
          },
          data: {
            theme: "dark",
          },
        });
      } else {
        updated = await prisma.user.update({
          where: {
            id: user?.id,
          },
          data: {
            theme: "light",
          },
        });
      }
    }
    // If the user wants to upate the bio
    else if (bio) {
      // Cleaning the text
      const cleanBio = textCleaner(bio);
      // Updating the bio
      updated = await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          bio: cleanBio,
        },
      });
    }

    return res.json(updated);
  },
};

export default AccountController;
