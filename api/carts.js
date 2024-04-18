const cartsRouter = require("express").Router();
const { requireUser } = require("./utils");
const {
  getAllCarts,
  getLatestCartByUserId,
  getCartProductsByCart,
  updateCart,
  deleteCart,
  createCart,
} = require("../db/carts");
const { carts } = require("../db/client");

//CREATE
cartsRouter.post("/", requireUser, async (req, res) => {
  try {
    const newCart = await createCart({
      userId: req.user.userId,
    });
    res.send({ newCart });
  } catch (error) {
    res.status(500).send({ error, message: "Could not create cart" });
  }
});

//READ - get all the carts
cartsRouter.get("/", async (req, res) => {
  console.log("req", req);
  try {
    const carts = await getAllCarts();
    res.send(carts);
  } catch (error) {
    res.status(500).send({ error, message: "Could not get all carts" });
  }
});

//READ - get specific user's cart
cartsRouter.get("/:userId", requireUser, async (req, res) => {
  console.log("req", req.user);
  try {
    const cart = await getLatestCartByUserId(parseInt(req.params.userId));
    res.send(cart);
  } catch (error) {
    res.status(500).send({ error, message: "Could not get user's cart" });
  }
});

//UPDATE
cartsRouter.put("/:userId", requireUser, async (req, res) => {
  try {
    const { products } = req.body;
    const cart = await updateCart(parseInt(req.params.cartId), {
      products,
    });
  } catch {}
});

//DELETE
cartsRouter.delete("/");

module.exports = cartsRouter;
