import Express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const SearchAPIController = {
  query: async (req: Express.Request, res: Express.Response) => {
    const { q } = req.query;

    if (!q) return res.status(400).send();
    else {
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            {
              body: {
                contains: q.toString(),
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      const users = await prisma.user.findMany({
        where: {
          OR: [
            {
              bio: q.toString(),
            },
            {
              firstName: q.toString(),
            },
            {
              lastName: q.toString(),
            },
            {
              username: q.toString(),
            },
          ],
          NOT: {
            id: req.user?.id,
          },
          privateAccount: false,
        },
        select: {
          id: true,
          bio: true,
          roles: true,
          avatar: true,
          lastName: true,
          username: true,
          firstName: true,
        },
      });

      return res.json({ posts, users });
    }
  },
};

export default SearchAPIController;
