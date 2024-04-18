const express = require("express")
const server = express()
const bodyParser = require("body-parser")

const authRouter = require("./api/auth")
const productsRouter = require("./api/products")
const apiRouter = require("./api")


//json body parser
server.use(bodyParser.json());

server.use("/auth", authRouter);
server.use("/api", apiRouter);

server.use("/", (req, res) => {
  res.send("Working");
});

module.exports = server;