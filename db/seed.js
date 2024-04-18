const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding the database...");
  try {
    //create 10 users
    const users = await Promise.all(
      [...Array(10)].map(() =>
        prisma.users.create({
          data: {
            email: faker.internet.email(),
            password: faker.internet.password(),
            name: faker.person.fullName(),
          },
        })
      )
    );

    const conditions = ["used", "gently used", "like new", "brand new"];

    //Add 3 products for each user
    const products = await Promise.all(
      [...Array(10)].map(async () => {
        const randomNumber = faker.number.int({
          min: 0,
          max: conditions.length - 1,
        });

        return prisma.products.create({
          data: {
            title: faker.commerce.productName(),
            price: Number(faker.commerce.price()),
            category: faker.commerce.department(),
            img_url: faker.image.url(),
            description: faker.commerce.productDescription(),
            condition: conditions[randomNumber],
            userId: users[Math.floor(Math.random() * 10)].userId,
          },
        });
      })
    );

    console.log(products);
    //Create carts for 3 users
    await Promise.all(
      [...Array(3)].map((_, i) =>
        prisma.carts.create({
          data: {
            userId: users[Math.floor(Math.random() * 10)].userId,
            // products: {
            //   create: [
            //     {
            //       connect: products[i],
            //     },
            //   ],
            // },
          },
        })
      )
    );

    console.log("Database is seeded.");
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

// Seed the database if we are running this file directly.
if (require.main === module) {
  seed()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      return e;
    });
}

module.exports = { seed };
