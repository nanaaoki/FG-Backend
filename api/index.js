const apiRouter = require("express").Router();
const { checkToken } = require("./middlewares");


// GET /api/health
apiRouter.get("/health", (req, res, next) => {
  res.send("OK");
});


apiRouter.use(checkToken);

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});

// place your routers here

//ROUTER: /api/users
const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

//ROUTER: /api/products
const productsRouter = require("./products");
apiRouter.use("/products", productsRouter);

//ROUTER: /api/carts
const cartsRouter = require("./carts");
apiRouter.use("/carts", cartsRouter);

//ROUTER: /api/auth
const authRouter = require("./auth");
apiRouter.use("/auth", authRouter);

module.exports = apiRouter;
