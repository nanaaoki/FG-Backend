const productsRouter = require("express").Router();

const {
  createProduct,
  getUserProducts,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
} = require("../db/products");

const { checkProduct } = require("./middlewares");
const { requireUser } = require("./utils");

//READ /api/products/
productsRouter.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

//READ /api/products/user/:userId - get product of specific user
productsRouter.get("/user/:userId", async (req, res) => {
  try {
    const products = await getUserProducts(parseInt(req.params.userId));
    res.send({ products });
  } catch (error) {
    res.status(500).send({ error, message: "Could not get user's products" });
  }
});

//READ /api/products/:productId - get product of specific id
productsRouter.get("/:productId", async (req, res) => {
  try {
    const product = await getProductById(parseInt(req.params.productId));

    res.send({ product });
  } catch (error) {
    res.status(500).send({ error, message: "Could not get specific product" });
  }
});

//CREATE /api/products - create product
productsRouter.post("/", checkProduct, async (req, res) => {
  console.log("req.", req.body);
  try {
    const newProduct = await createProduct({
      ...req.body,
      userId: req.user.userId,
    });
    console.log("new product", newProduct);
    res.send({ newProduct });
  } catch (error) {
    res
      .status(500)
      .send({ error, message: "Could not create product for user" });
  }
});

//UPDATE /api/products/:id
productsRouter.put("/:productId", async (req, res) => {
  try {
    const { title, price, category, img_url, description, condition } =
      req.body;
    const product = await updateProduct(parseInt(req.params.productId), {
      title,
      price,
      category,
      img_url,
      description,
      condition,
    });
    res.send({ product });
  } catch (error) {
    res.status(500).send({ error, message: "Updated the product" });
  }
});

//DELETE /api/products/:id
productsRouter.delete("/:productId", requireUser, async (req, res) => {
  try {
    const product = await getProductById(req.params.productId);
    if (product.userId !== req.user.userId) {
      throw new Error("Not authorized to delete this product");
    }
    await deleteProduct(parseInt(req.params.productId));
    res.send({ message: "Successfully deleted product" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = productsRouter;
