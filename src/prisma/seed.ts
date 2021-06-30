import faker from "faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function seed() {
  const user = await prisma.user.create({
    data: {
      avatar: faker.internet.url(),
      bio: faker.lorem.paragraph(),
      email: "test@test7.com",
      lastName: faker.name.lastName(),
      firstName: faker.name.firstName(),
      password: "12345678",
      username: faker.internet.userName(),
      privateAccount: faker.datatype.boolean(),
    },
  });

  const post = await prisma.post.create({
    data: {
      userId: user.id,
      body: faker.lorem.slug(300),
    },
  });

  const save = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      saved: {
        set: [
          {
            id: post.id,
          },
        ],
      },
    },
  });

  const saved = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
    include: {
      saved: true,
      posts: true,
      comments: true,
      notifications: true,
    },
  });

  console.dir({ save, saved, post, user }, { depth: 10000 });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
