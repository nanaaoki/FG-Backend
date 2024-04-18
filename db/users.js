const prisma = require("./client");

const checkEmail = async (email) => {
  let userEmail = null;
  console.log(email);
  if (email) {
    userEmail = await prisma.users.findUnique({
      where: {
        email,
      },
    });
  }
  console.log(userEmail);
  return !!userEmail;
};

//CREATE -/api/users - create a new user
const createUser = async (userData) => {
  const u = await prisma.users.create({
    data: { ...userData },
  });
  return u;
};

//READ - get user by their email address
const getUserByEmail = (email) => {
  return prisma.users.findUnique({
    where: {
      email,
    },
  });
};

//READ -/api/users/:userId - get a single user
const getUserById = (userId) => {
  return prisma.users.findUnique({
    where: {
      userId,
    },
  });
};

//READ -/api/users - get all users
async function getAllUsers() {
  try {
    const users = await prisma.users.findMany({
      orderBy: {
        title: "asc",
      },
    });
    return users;
  } catch (err) {
    throw err;
  }
}

//UPDATE -/api/users/:id -update a single user by id
const updateUser = (userId, userData) => {
  return prisma.users.update({
    where: { userId },
    data: userData,
  });
};

//DELETE -/api/users/:id delete a single user by id
const deleteUser = (userId) => {
  return prisma.users.delete({
    where: {
      userId,
    },
  });
};

module.exports = {
  checkEmail,
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};
