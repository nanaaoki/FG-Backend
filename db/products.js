const prisma = require("./client");

//CREATE -/api/products - create a new product
const createProduct = (productData) => {
  console.log("pdata", productData);
  return prisma.products.create({
    data: productData,
  });
};

//READ - /api/products/users/:userId - all products that belong to specific user
const getUserProducts = (userId) => {
  return prisma.products.findMany({
    where: {
      userId,
    },
    orderBy: {
      title: "asc",
    },
  });
};

//READ -/api/products - get all products
async function getAllProducts() {
  try {
    const products = await prisma.products.findMany({
      orderBy: {
        title: "asc",
      },
    });
    return products;
  } catch (err) {
    throw err;
  }
}

//READ -/api/products/:id - get a single product
async function getProductById(productId) {
  try {
    const product = await prisma.products.findUnique({
      where: {
        productId: parseInt(productId),
      },
    });
    return product;
  } catch (error) {
    throw error;
  }
}

//UPDATE -/api/products/:id -update a single product by id
const updateProduct = (productId, productData) => {
  return prisma.products.update({
    where: {productId: parseInt(productId) },
    data: productData,
  });
};

//DELETE -/api/products/:id delete a single product by id
const deleteProduct = (productId) => {
  return prisma.products.delete({
    where: {
      productId: parseInt(productId),
    },
  });
};

module.exports = {
  createProduct,
  getUserProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
