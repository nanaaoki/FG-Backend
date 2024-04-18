const prisma = require("./client");

//READ -/api/carts - get all carts
async function getAllCarts() {
  try {
    const carts = await prisma.carts.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return carts;
  } catch (err) {
    throw err;
  }
}

//READ -/api/users/:id/carts/ - get a single cart
async function getLatestCartByUserId(userId) {
  try {
    const cart = await prisma.carts.findFirst({
      where: {
        userId: praseInt(userId),
      },
      orderBy: {
        id: "desc",
      },
    });
    return cart;
  } catch (error) {
    throw error;
  }
}

//READ cartproducts by cart. gets all info of products
async function getCartProductsByCart(cartId) {
  try {
    const results = await prisma.products.findMany({
      where: {
        carts: {
          has: cartId,
        },
      },
    });
    return results;
  } catch (error) {
    throw error;
  }
}

//CREATE -/api/users/cart - create a new cart
async function createCart(userId) {
  try {
    const cart = await prisma.carts.create({
      data: { userId: parseInt(userId) },
    });
    return cart;
  } catch (error) {
    throw error;
  }
}

//UPDATE -/api/users/:id/cart -update a single cart by userid
async function updateCart(userId, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => ` "${key}" = $${index + 1}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }
  try {
    const cart = await prisma.carts.update({
      where: {
        userId: parseInt(userId),
      },
      data: fields,
    });
    return cart;
  } catch (error) {
    throw error;
  }
}

//DELETE -/api/users/:id delete a single user by id
async function deleteCart(userId) {
  try {
    const cart = await prisma.carts.deleteMany({
      where: {
        id: userId,
      },
    });
    return cart;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllCarts,
  getLatestCartByUserId,
  getCartProductsByCart,
  updateCart,
  deleteCart,
  createCart,
};
